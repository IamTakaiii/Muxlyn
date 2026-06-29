import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DryRunResponse } from '../../api/smart-worklog';

interface Props {
  data: DryRunResponse;
}

function formatTimeRange(startTime: string, hours: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + Math.round(hours * 60);
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  const endStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  return `${startTime} – ${endStr}`;
}

export function DryRunPreview({ data }: Props) {
  const { t } = useTranslation();
  const { summary, days, warnings } = data;

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.map((w) => (
            <div
              key={w}
              className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200"
            >
              <AlertCircle size={14} className="shrink-0" />
              {w === 'Routine tasks exceed daily hours.'
                ? t('smartWorklog.routineExceeds')
                : w === 'No working days in this month.'
                  ? t('smartWorklog.noWorkingDays')
                  : w}
            </div>
          ))}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Calendar size={12} />
            {t('smartWorklog.workingDays')}
          </div>
          <div className="text-2xl font-semibold">{summary.totalWorkingDays}</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-xs text-muted-foreground mb-1">{t('smartWorklog.holidays')}</div>
          <div className="text-2xl font-semibold">{summary.totalHolidays}</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-xs text-muted-foreground mb-1">Worklogs</div>
          <div className="text-2xl font-semibold">{summary.totalWorklogs}</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-xs text-muted-foreground mb-1">Total Hours</div>
          <div className="text-2xl font-semibold">{summary.totalHours}h</div>
        </div>
      </div>

      {/* Day list */}
      <div className="max-h-[400px] space-y-1.5 overflow-y-auto pr-1">
        {days.map((day) => (
          <div
            key={day.date}
            className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
              day.isHoliday
                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50'
                : 'bg-card'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={13} className={day.isHoliday ? 'text-red-500' : 'text-muted-foreground'} />
              <span className="font-medium">{day.date}</span>
              {day.isHoliday && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                  {t('smartWorklog.holidays')}
                </span>
              )}
            </div>

            {day.routineWorklogs.length > 0 && (
              <div className="ml-5 mt-1.5 space-y-0.5">
                {day.routineWorklogs.map((wl) => (
                  <div
                    key={`${day.date}-${wl.issueId}-${wl.startTime}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Clock size={10} className="shrink-0" />
                    <span className="font-medium text-foreground">{wl.issueKey}</span>
                    <span>{formatTimeRange(wl.startTime, wl.hours)}</span>
                  </div>
                ))}
              </div>
            )}

            {day.distributeWorklogs.length > 0 && (
              <div className="ml-5 mt-1 space-y-0.5">
                {day.distributeWorklogs.map((wl) => (
                  <div
                    key={`${day.date}-${wl.issueId}-${wl.startTime}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Clock size={10} className="shrink-0" />
                    <span className="font-medium text-foreground">{wl.issueKey}</span>
                    <span>{formatTimeRange(wl.startTime, wl.hours)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
