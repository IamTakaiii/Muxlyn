export interface RoutineTaskInput {
  issueId: string;
  startTime: string;
  endTime: string;
}

export interface DistributeTaskInput {
  issueId: string;
  percentage: number;
}

export interface PlannerInput {
  year: number;
  month: number;
  holidays: string[];
  dailyHours: number;
  routineTasks: RoutineTaskInput[];
  distributeTasks: DistributeTaskInput[];
  holidayTaskIssueId?: string;
  language?: 'en' | 'th';
  workdayStart?: string;
}

export interface PlannedWorklog {
  issueId: string;
  issueKey: string;
  startTime: string;
  hours: number;
}

export interface DryRunDay {
  date: string;
  isWorkingDay: boolean;
  isHoliday: boolean;
  routineWorklogs: PlannedWorklog[];
  distributeWorklogs: PlannedWorklog[];
}

export interface DryRunSummary {
  totalWorkingDays: number;
  totalHolidays: number;
  totalWorklogs: number;
  totalHours: number;
  routineHoursPerDay: number;
  remainingHoursPerDay: number;
}

export interface DryRunResponse {
  summary: DryRunSummary;
  days: DryRunDay[];
  warnings: string[];
}

export type CreateErrorCode =
  | 'SUBTASK'
  | 'ZERO_DURATION'
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'PERMISSION'
  | 'RATE_LIMIT'
  | 'DUPLICATE'
  | 'UNKNOWN';

export interface CreateResultItem {
  issueId: string;
  issueKey: string;
  date: string;
  hours: number;
  status: 'created' | 'skipped' | 'failed';
  worklogId?: string;
  error?: string;
  errorCode?: CreateErrorCode;
}

export type CreateSessionStatus =
  | 'running'
  | 'completed'
  | 'partial'
  | 'rate_limited'
  | 'auth_error';

export interface CreateAllResponse {
  sessionId: string;
  total: number;
  succeeded: number;
  failed: number;
  skipped: number;
  totalHours: number;
  results: CreateResultItem[];
  status: CreateSessionStatus;
  stoppedAt?: string;
}

export interface CreateStatusResponse {
  sessionId: string;
  total: number;
  completed: number;
  currentDate?: string;
  currentIssueKey?: string;
  status: CreateSessionStatus;
  errors: number;
}

export interface RetryRequest {
  sessionId: string;
  onlyFailed?: boolean;
}

export interface CreateSessionState {
  sessionId: string;
  userId: string;
  startedAt: number;
  plan: PlannedWorklog[];
  results: CreateResultItem[];
  status: CreateSessionStatus;
  currentIndex: number;
  stoppedAt: string | null;
  jiraConnectionId: string;
}

export interface IssueInfo {
  issueId: string;
  issueKey: string;
  isSubtask: boolean;
}
