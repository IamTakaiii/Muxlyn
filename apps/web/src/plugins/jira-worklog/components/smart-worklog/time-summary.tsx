import { CalendarDays, Clock, Hourglass, Settings2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { usePlannerStore } from '../../state/planner-store';
import { useWorkingDays } from '../../state/use-working-days';

export function TimeSummary() {
  const { t } = useTranslation();
  const routineTasks = usePlannerStore((s) => s.routineTasks);
  const dailyHours = usePlannerStore((s) => s.dailyHours);
  const holidays = usePlannerStore((s) => s.holidays);
  const year = usePlannerStore((s) => s.year);
  const month = usePlannerStore((s) => s.month);

  const workingDays = useWorkingDays(year, month, holidays);

  const routineHours = useMemo(() => {
    return routineTasks.reduce((sum, task) => {
      const [sh, sm] = task.startTime.split(':').map(Number);
      const [eh, em] = task.endTime.split(':').map(Number);
      return sum + (eh * 60 + em - sh * 60 - sm) / 60;
    }, 0);
  }, [routineTasks]);

  const remainingHours = Math.max(0, dailyHours - routineHours);
  const routinePct = dailyHours > 0 ? Math.min(100, (routineHours / dailyHours) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 min-w-0">
      {/* Working Days */}
      <div className="rounded-lg border bg-card p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays size={12} />
          {t('smartWorklog.workingDays')}
        </div>
        <div className="text-2xl font-semibold">{workingDays}</div>
        <div className="text-xs text-muted-foreground">
          {holidays.length > 0
            ? `${holidays.length} holiday${holidays.length > 1 ? 's' : ''} off`
            : 'No holidays'}
        </div>
      </div>

      {/* Routine Hours */}
      <div className="rounded-lg border bg-card p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} />
          {t('smartWorklog.routineHours')}
        </div>
        <div className="text-2xl font-semibold">{routineHours.toFixed(1)}h</div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${routinePct}%` }}
          />
        </div>
      </div>

      {/* Remaining Hours */}
      <div className="rounded-lg border bg-card p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Hourglass size={12} />
          {t('smartWorklog.remainingHours')}
        </div>
        <div
          className={`text-2xl font-semibold ${remainingHours === 0 && routineHours > 0 ? 'text-red-500' : ''}`}
        >
          {remainingHours.toFixed(1)}h
        </div>
        <div className="text-xs text-muted-foreground">
          {remainingHours === 0 && routineHours > 0
            ? 'Fully allocated to routine'
            : 'for distribute tasks'}
        </div>
      </div>

      {/* Daily Hours */}
      <div className="rounded-lg border bg-card p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Settings2 size={12} />
          {t('smartWorklog.dailyHours')}
        </div>
        <div className="flex items-baseline gap-1">
          <Input
            type="number"
            value={dailyHours}
            min={0.25}
            max={24}
            step={0.25}
            onChange={(e) => usePlannerStore.getState().setDailyHours(Number(e.target.value))}
            className="border-0 border-b rounded-none px-0 h-auto text-2xl font-semibold w-14 focus-visible:ring-0"
          />
          <span className="text-sm text-muted-foreground">h/day</span>
        </div>
        <div className="text-xs text-muted-foreground">tap to edit</div>
      </div>
    </div>
  );
}
