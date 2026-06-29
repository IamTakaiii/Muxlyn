import { Ban, X } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { Input } from '@/shared/components/ui/input';
import { usePlannerStore } from '../../state/planner-store';

export function HolidayManager() {
  const { t } = useTranslation();
  const holidays = usePlannerStore((s) => s.holidays);
  const holidayTaskIssueId = usePlannerStore((s) => s.holidayTaskIssueId);
  const addHoliday = usePlannerStore((s) => s.addHoliday);
  const removeHoliday = usePlannerStore((s) => s.removeHoliday);
  const setHolidayTaskIssueId = usePlannerStore((s) => s.setHolidayTaskIssueId);
  const year = usePlannerStore((s) => s.year);
  const month = usePlannerStore((s) => s.month);
  const dailyHours = usePlannerStore((s) => s.dailyHours);

  const startMonth = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const endMonth = useMemo(() => new Date(year, month - 1, 1), [year, month]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <Ban size={14} className="text-muted-foreground" />
            {t('smartWorklog.holidays')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dates excluded from working days
          </p>
        </div>

        {/* Holiday task issue + hours — only when holidays exist */}
        {holidays.length > 0 && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-sm">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Log to</span>
            <Input
              type="text"
              value={holidayTaskIssueId}
              onChange={(e) => setHolidayTaskIssueId(e.target.value)}
              placeholder="ADM-1"
              className="h-6 w-20 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              · {dailyHours}h/day
            </span>
          </div>
        )}
      </div>

      {/* Holiday badges + date picker */}
      <div className="flex flex-wrap gap-2">
        {holidays.length === 0 && (
          <span className="text-xs text-muted-foreground italic">No holidays added</span>
        )}

        {holidays.map((date) => (
          <span
            key={date}
            className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
          >
            {date}
            <button
              type="button"
              onClick={() => removeHoliday(date)}
              className="ml-1 rounded-full p-0.5 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              <X size={11} />
            </button>
          </span>
        ))}

        <div className="w-[200px]">
          <DatePicker
            value=""
            onChange={(date) => addHoliday(date)}
            placeholder={t('smartWorklog.addHoliday')}
            startMonth={startMonth}
            endMonth={endMonth}
          />
        </div>
      </div>
    </div>
  );
}
