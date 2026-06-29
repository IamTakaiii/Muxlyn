import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

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

export interface CreateResultItem {
  issueId: string;
  issueKey: string;
  date: string;
  hours: number;
  status: 'created' | 'skipped' | 'failed';
  worklogId?: string;
  error?: string;
  errorCode?: string;
}

export interface CreateAllResponse {
  sessionId: string;
  total: number;
  succeeded: number;
  failed: number;
  skipped: number;
  totalHours: number;
  results: CreateResultItem[];
  status: string;
  stoppedAt?: string;
}

export interface CreateStatusResponse {
  sessionId: string;
  total: number;
  completed: number;
  currentDate?: string;
  currentIssueKey?: string;
  status: string;
  errors: number;
}

export function useDryRun() {
  return useMutation({
    mutationFn: (input: PlannerInput) =>
      api.post<DryRunResponse>('/api/smart-worklog/dry-run', input),
  });
}

export function useCreateAll() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: PlannerInput) =>
      api.post<{ sessionId: string; total: number; status: string }>(
        '/api/smart-worklog/create',
        input,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['smart-worklog'], exact: false });
    },
  });
}

export function useCreateStatus(sessionId: string | null) {
  return useQuery({
    queryKey: ['smart-worklog', 'status', sessionId],
    queryFn: async () => {
      const res = await api.get<CreateStatusResponse>(
        `/api/smart-worklog/create/status?sessionId=${sessionId}`,
      );
      if (!res.success || !res.data) {
        throw new Error(res.error?.code ?? 'Failed to fetch status');
      }
      return res.data;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      if (!query.state.data) return 1000;
      if (query.state.data.status === 'running') return 1000;
      return false;
    },
  });
}

export function useRetry() {
  return useMutation({
    mutationFn: ({ sessionId, onlyFailed }: { sessionId: string; onlyFailed?: boolean }) =>
      api.post<CreateAllResponse>('/api/smart-worklog/create/retry', {
        sessionId,
        onlyFailed,
      }),
  });
}
