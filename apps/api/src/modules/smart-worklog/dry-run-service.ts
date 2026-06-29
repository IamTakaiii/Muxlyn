import type { JiraConnection } from '../worklog/jira-worklog-client';
import { getActiveJiraConnection, getJiraIssue } from '../worklog/jira-worklog-client';
import { PreflightError } from './errors';
import { computePlan, durationHours } from './planner-service';
import type { DryRunResponse, IssueInfo, PlannerInput } from './types';

export async function dryRun(userId: string, input: PlannerInput): Promise<DryRunResponse> {
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

  return computePlan(input, issueMap);
}

async function fetchIssueInfo(
  connection: JiraConnection,
  issueIds: string[],
): Promise<Map<string, IssueInfo>> {
  const map = new Map<string, IssueInfo>();

  const issues = await Promise.all(
    issueIds.map(async (issueId) => {
      const issue = await getJiraIssue(connection, issueId);
      return {
        issueId,
        issueKey: issue.key,
        isSubtask: issue.isSubtask,
      };
    }),
  );

  for (const info of issues) {
    map.set(info.issueId, info);
  }

  return map;
}

export function validateInput(input: PlannerInput, issueMap: Map<string, IssueInfo>): void {
  const fieldErrors: { field?: string; message: string; code: string }[] = [];

  for (let i = 0; i < input.routineTasks.length; i++) {
    const t = input.routineTasks[i];
    const prefix = `routineTasks[${i}]`;

    if (!/^\d{2}:\d{2}$/.test(t.startTime) || !/^\d{2}:\d{2}$/.test(t.endTime)) {
      fieldErrors.push({
        field: `${prefix}`,
        message: 'Time must be in HH:mm format.',
        code: 'INVALID_TIME_FORMAT',
      });
      continue;
    }

    if (t.startTime >= t.endTime) {
      fieldErrors.push({
        field: `${prefix}`,
        message: 'Start time must be before end time.',
        code: 'START_AFTER_END',
      });
    }

    const dur = durationHours(t.startTime, t.endTime);
    if (dur <= 0) {
      fieldErrors.push({
        field: `${prefix}`,
        message: 'Duration must be greater than 0.',
        code: 'ZERO_DURATION',
      });
    }

    if (dur > 24) {
      fieldErrors.push({
        field: `${prefix}`,
        message: 'Routine task cannot span across midnight.',
        code: 'CROSS_MIDNIGHT',
      });
    }

    const info = issueMap.get(t.issueId);
    if (info?.isSubtask) {
      fieldErrors.push({
        field: `${prefix}`,
        message: 'Cannot log work on sub-tasks.',
        code: 'SUBTASK',
      });
    }
  }

  if (input.distributeTasks.length > 20) {
    fieldErrors.push({
      field: 'distributeTasks',
      message: 'Maximum 20 distribute tasks allowed.',
      code: 'MAX_TASKS',
    });
  }

  const totalPct = input.distributeTasks.reduce((sum, t) => sum + t.percentage, 0);
  if (input.distributeTasks.length > 0 && Math.abs(totalPct - 100) > 0.5) {
    fieldErrors.push({
      field: 'distributeTasks',
      message: `Allocation must total 100% (currently ${totalPct}%).`,
      code: 'PERCENTAGE_SUM',
    });
  }

  for (let i = 0; i < input.distributeTasks.length; i++) {
    const t = input.distributeTasks[i];
    const info = issueMap.get(t.issueId);
    if (info?.isSubtask) {
      fieldErrors.push({
        field: `distributeTasks[${i}]`,
        message: 'Cannot log work on sub-tasks.',
        code: 'SUBTASK',
      });
    }
  }

  if (fieldErrors.length > 0) {
    throw new PreflightError(fieldErrors);
  }
}
