import { CheckCircle2, ChevronRight, Eye, Loader2, Settings, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import type {
  CreateAllResponse,
  CreateStatusResponse,
  DryRunResponse,
} from '../../api/smart-worklog';
import { useCreateAll, useDryRun } from '../../api/smart-worklog';
import { CreateProgress } from '../../components/smart-worklog/create-progress';
import { DistributeTaskEditor } from '../../components/smart-worklog/distribute-task-editor';
import { DryRunPreview } from '../../components/smart-worklog/dry-run-preview';
import { HolidayManager } from '../../components/smart-worklog/holiday-manager';
import { MonthSelector } from '../../components/smart-worklog/month-selector';
import { ResultsSummary } from '../../components/smart-worklog/results-summary';
import { RetryDialog } from '../../components/smart-worklog/retry-dialog';
import { RoutineTaskEditor } from '../../components/smart-worklog/routine-task-editor';
import { TimeSummary } from '../../components/smart-worklog/time-summary';
import { usePlannerStore } from '../../state/planner-store';

type Phase = 'setup' | 'dry-run' | 'creating' | 'done';

const STEPS: { key: Phase; label: string; icon: React.ReactNode }[] = [
  { key: 'setup', label: 'Setup', icon: <Settings size={13} /> },
  { key: 'dry-run', label: 'Preview', icon: <Eye size={13} /> },
  { key: 'creating', label: 'Creating', icon: <Loader2 size={13} /> },
  { key: 'done', label: 'Done', icon: <CheckCircle2 size={13} /> },
];

const PHASE_ORDER: Phase[] = ['setup', 'dry-run', 'creating', 'done'];

export default function MonthlyPlanner() {
  const { t } = useTranslation();

  const year = usePlannerStore((s) => s.year);
  const month = usePlannerStore((s) => s.month);
  const holidays = usePlannerStore((s) => s.holidays);
  const dailyHours = usePlannerStore((s) => s.dailyHours);
  const routineTasks = usePlannerStore((s) => s.routineTasks);
  const holidayTaskIssueId = usePlannerStore((s) => s.holidayTaskIssueId);
  const distributeTasks = usePlannerStore((s) => s.distributeTasks);
  const workdayStart = usePlannerStore((s) => s.workdayStart);

  const dryRunMutation = useDryRun();
  const createMutation = useCreateAll();

  const [phase, setPhase] = useState<Phase>('setup');
  const [dryRunData, setDryRunData] = useState<DryRunResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [createResult, setCreateResult] = useState<CreateAllResponse | null>(null);
  const [dryRunError, setDryRunError] = useState<string | string[] | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const plannerSignature = useMemo(
    () =>
      JSON.stringify({
        year,
        month,
        holidays,
        dailyHours,
        routineTasks,
        distributeTasks,
        holidayTaskIssueId,
        workdayStart,
      }),
    [year, month, holidays, dailyHours, routineTasks, distributeTasks, holidayTaskIssueId, workdayStart],
  );
  const previousPlannerSignature = useRef(plannerSignature);

  useEffect(() => {
    if (previousPlannerSignature.current === plannerSignature) return;

    previousPlannerSignature.current = plannerSignature;

    if (phase === 'dry-run') {
      setPhase('setup');
      setDryRunData(null);
      setDryRunError(null);
      setCreateError(null);
    }
  }, [plannerSignature, phase]);

  function handleDryRun() {
    setDryRunError(null);
    dryRunMutation.mutate(
      {
        year,
        month,
        holidays,
        dailyHours,
        routineTasks: routineTasks.map((t) => ({
          issueId: t.issueId,
          startTime: t.startTime,
          endTime: t.endTime,
        })),
        distributeTasks: distributeTasks.map((t) => ({
          issueId: t.issueId,
          percentage: t.percentage,
        })),
        holidayTaskIssueId: holidayTaskIssueId || undefined,
        workdayStart,
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setDryRunData(res.data);
            setPhase('dry-run');
          } else {
            const details = res.error?.details as
              | { fields?: { field?: string; message: string }[] }
              | undefined;
            if (details?.fields && details.fields.length > 0) {
              setDryRunError(details.fields.map((f) => f.message));
            } else {
              setDryRunError(res.error?.code ?? 'Failed to run dry run');
            }
          }
        },
        onError: () => {
          setDryRunError('Failed to run dry run');
        },
      },
    );
  }

  function handleCreateAll() {
    setCreateError(null);
    createMutation.mutate(
      {
        year,
        month,
        holidays,
        dailyHours,
        routineTasks: routineTasks.map((t) => ({
          issueId: t.issueId,
          startTime: t.startTime,
          endTime: t.endTime,
        })),
        distributeTasks: distributeTasks.map((t) => ({
          issueId: t.issueId,
          percentage: t.percentage,
        })),
        holidayTaskIssueId: holidayTaskIssueId || undefined,
        workdayStart,
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setSessionId(res.data.sessionId);
            setPhase('creating');
          } else {
            setCreateError(res.error?.code ?? 'Failed to start creation');
          }
        },
        onError: () => {
          setCreateError('Failed to start creation');
        },
      },
    );
  }

  function handleCreateComplete(status: CreateStatusResponse) {
    if (status.status !== 'running') {
      setPhase('done');
    }
  }

  function handleRetryResult(result: CreateAllResponse) {
    setCreateResult(result);
    setPhase('done');
  }

  function handleReset() {
    setPhase('setup');
    setDryRunData(null);
    setSessionId(null);
    setCreateResult(null);
    setDryRunError(null);
    setCreateError(null);
  }

  const canDryRun = routineTasks.length > 0 || distributeTasks.length > 0;
  const currentStepIndex = PHASE_ORDER.indexOf(phase);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles size={18} className="text-muted-foreground" />
            {t('smartWorklog.monthlyPlanner')}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t('smartWorklog.monthlyPlanner_desc')}
          </p>
        </div>
        <div className="shrink-0">
          <MonthSelector />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 text-xs overflow-x-auto pb-0.5">
        {STEPS.map((step, i) => {
          const isDone = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <div key={step.key} className="flex items-center gap-1 shrink-0">
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-1 sm:px-2.5 font-medium transition-all ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isDone
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'text-muted-foreground'
                }`}
              >
                {isDone ? <CheckCircle2 size={12} /> : step.icon}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  size={12}
                  className={isDone ? 'text-green-500' : 'text-muted-foreground/40'}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Setup sections */}
      {(phase === 'setup' || phase === 'dry-run') && (
        <>
          {/* Time summary */}
          <TimeSummary />

          <div className="border-t" />

          {/* Holidays */}
          <HolidayManager />

          <div className="border-t" />

          {/* Routine Tasks */}
          <RoutineTaskEditor />

          <div className="border-t" />

          {/* Distribute Tasks */}
          <DistributeTaskEditor />
        </>
      )}

      {/* Dry Run Preview */}
      {dryRunData && phase === 'dry-run' && (
        <>
          <div className="border-t" />
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
              <Eye size={14} className="text-muted-foreground" />
              {t('smartWorklog.dryRunResults')}
            </h3>
            <DryRunPreview data={dryRunData} />
          </div>
        </>
      )}

      {/* Errors */}
      {dryRunError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {Array.isArray(dryRunError) ? (
            <ul className="list-disc pl-4 space-y-1">
              {dryRunError.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          ) : (
            dryRunError
          )}
        </div>
      )}

      {createError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {createError}
        </div>
      )}

      {/* Creating progress */}
      {phase === 'creating' && sessionId && (
        <CreateProgress sessionId={sessionId} onComplete={handleCreateComplete} />
      )}

      {/* Done */}
      {phase === 'done' && createResult && (
        <>
          <ResultsSummary result={createResult} />
          {createResult.status !== 'completed' && (
            <RetryDialog
              sessionId={createResult.sessionId}
              status={createResult.status}
              onResult={handleRetryResult}
            />
          )}
        </>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-2 border-t pt-4">
        {phase === 'setup' && (
          <Button
            onClick={handleDryRun}
            disabled={!canDryRun || dryRunMutation.isPending}
            className="gap-1.5"
          >
            {dryRunMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Eye size={14} />
                Preview Plan
              </>
            )}
          </Button>
        )}

        {phase === 'dry-run' && dryRunData && (
          <>
            <Button variant="outline" onClick={handleReset}>
              ← Back
            </Button>
            <Button onClick={handleCreateAll} disabled={createMutation.isPending} className="gap-1.5">
              {createMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  {t('smartWorklog.createAll')}
                </>
              )}
            </Button>
          </>
        )}

        {phase === 'done' && (
          <Button variant="outline" onClick={handleReset}>
            New Plan
          </Button>
        )}
      </div>
    </div>
  );
}
