import {
  JiraInvalidTokenError,
  JiraNetworkError,
  JiraNoPermissionError,
} from '../../shared/errors';
import type { JiraConnection } from '../worklog/jira-worklog-client';
import {
  createJiraWorklog,
  getActiveJiraConnection,
  getJiraIssue,
} from '../worklog/jira-worklog-client';
import { validateInput } from './dry-run-service';
import { checkDuplicates } from './duplicate-check';
import { computePlan } from './planner-service';
import { createSession, getSession, setSessionStatus } from './session-store';
import type {
  CreateAllResponse,
  CreateResultItem,
  CreateSessionStatus,
  DryRunResponse,
  IssueInfo,
  PlannedWorklog,
  PlannerInput,
} from './types';

interface PlanItem extends PlannedWorklog {
  date: string;
}

function toStartedDatetime(dateStr: string, startTime: string): string {
  return `${dateStr}T${startTime}:00.000+0000`;
}

class JiraRateLimitError extends JiraNetworkError {
  constructor() {
    super('Jira rate limit reached. Please wait and try again.');
  }
}

export async function createAll(
  userId: string,
  authorAccountId: string,
  input: PlannerInput,
): Promise<{ sessionId: string; total: number }> {
  const connection = await getActiveJiraConnection(userId);

  const uniqueIssueIds = [
    ...new Set([
      ...input.routineTasks.map((t) => t.issueId),
      ...input.distributeTasks.map((t) => t.issueId),
      ...(input.holidayTaskIssueId ? [input.holidayTaskIssueId] : []),
    ]),
  ];

  const issueMap = await fetchIssueInfo(connection, uniqueIssueIds);
  validateInput(input, issueMap);

  const plan = computePlan(input, issueMap);
  const plannedItems = flattenPlan(plan);

  const sessionId = crypto.randomUUID();

  createSession({
    sessionId,
    userId,
    plan: plannedItems,
    results: [],
    status: 'running',
    currentIndex: 0,
    stoppedAt: null,
    jiraConnectionId: connection.id,
  });

  processCreateSession(sessionId, connection, authorAccountId);

  return { sessionId, total: plannedItems.length };
}

async function fetchIssueInfo(
  connection: JiraConnection,
  issueIds: string[],
): Promise<Map<string, IssueInfo>> {
  const map = new Map<string, IssueInfo>();
  const issues = await Promise.all(
    issueIds.map(async (issueId) => {
      const issue = await getJiraIssue(connection, issueId);
      return { issueId, issueKey: issue.key, isSubtask: issue.isSubtask };
    }),
  );
  for (const info of issues) {
    map.set(info.issueId, info);
  }
  return map;
}

function flattenPlan(plan: DryRunResponse): PlanItem[] {
  const items: PlanItem[] = [];

  for (const day of plan.days) {
    const dayItems = [...day.routineWorklogs, ...day.distributeWorklogs].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    for (const wl of dayItems) {
      items.push({ ...wl, date: day.date });
    }
  }

  return items;
}

async function processCreateSession(
  sessionId: string,
  connection: JiraConnection,
  authorAccountId: string,
): Promise<void> {
  const session = getSession(sessionId);
  if (!session) return;

  const planItems = session.plan as unknown as PlanItem[];

  const uniqueIssueIds = [...new Set(planItems.map((w) => w.issueId))];

  let duplicateKeys: Set<string> = new Set();
  try {
    const allDates = [...new Set(planItems.map((w) => w.date))];
    duplicateKeys = await checkDuplicates(connection, uniqueIssueIds, allDates, authorAccountId);
  } catch {
    // duplicate check is best-effort, proceed anyway
  }

  const results: CreateResultItem[] = [...session.results];
  let completed = session.currentIndex;

  for (let i = session.currentIndex; i < planItems.length; i++) {
    const item = planItems[i];
    const dateStr = item.date;
    const dupKey = `${item.issueId}:${dateStr}`;

    if (duplicateKeys.has(dupKey)) {
      results.push({
        issueId: item.issueId,
        issueKey: item.issueKey,
        date: dateStr,
        hours: item.hours,
        status: 'skipped',
        errorCode: 'DUPLICATE',
      });
      completed = i + 1;
      session.currentIndex = completed;
      session.results = results;
      continue;
    }

    try {
      const durationSeconds = Math.max(1, Math.round(item.hours * 3600));
      const started = toStartedDatetime(dateStr, item.startTime);

      const worklog = await createJiraWorklog(connection, item.issueId, {
        timeSpentSeconds: durationSeconds,
        started,
      });

      results.push({
        issueId: item.issueId,
        issueKey: item.issueKey,
        date: dateStr,
        hours: item.hours,
        status: 'created',
        worklogId: worklog.id,
      });
      completed = i + 1;
    } catch (error) {
      if (error instanceof JiraInvalidTokenError) {
        setSessionStatus(sessionId, 'auth_error', dateStr);
        session.currentIndex = completed;
        session.results = results;
        return;
      }

      if (error instanceof JiraRateLimitError) {
        setSessionStatus(sessionId, 'rate_limited', dateStr);
        session.currentIndex = completed;
        session.results = results;
        return;
      }

      const errMsg = error instanceof Error ? error.message : 'An unexpected error occurred.';

      results.push({
        issueId: item.issueId,
        issueKey: item.issueKey,
        date: dateStr,
        hours: item.hours,
        status: 'failed',
        error: errMsg,
        errorCode: mapCreateErrorCode(error),
      });
    }

    session.currentIndex = completed;
    session.results = results;
  }

  const failed = results.filter((r) => r.status === 'failed').length;
  const finalStatus: CreateSessionStatus = failed > 0 ? 'partial' : 'completed';

  setSessionStatus(sessionId, finalStatus);
}

function mapCreateErrorCode(error: unknown): CreateAllResponse['results'][0]['errorCode'] {
  if (error instanceof JiraNoPermissionError) return 'PERMISSION';
  if (error instanceof JiraNetworkError) {
    if (error instanceof JiraRateLimitError) return 'RATE_LIMIT';
    return 'NETWORK';
  }
  if (error instanceof JiraInvalidTokenError) return 'UNAUTHORIZED';
  return 'UNKNOWN';
}
