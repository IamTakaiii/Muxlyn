import { Plus, Repeat, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { TimePicker } from '@/shared/components/ui/time-picker';
import { usePlannerStore } from '../../state/planner-store';
import { IssueSearchSelect } from '../issue-search-select';

export function RoutineTaskEditor() {
  const { t } = useTranslation();
  const routineTasks = usePlannerStore((s) => s.routineTasks);
  const addRoutineTask = usePlannerStore((s) => s.addRoutineTask);
  const removeRoutineTask = usePlannerStore((s) => s.removeRoutineTask);

  const [showForm, setShowForm] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:30');
  const [selectedIssue, setSelectedIssue] = useState<{
    id: string;
    key: string;
    summary: string;
  } | null>(null);

  function handleAdd() {
    if (startTime >= endTime) return;
    if (!selectedIssue) return;

    addRoutineTask({
      id: '',
      issueId: selectedIssue.id,
      issueKey: selectedIssue.key,
      issueSummary: selectedIssue.summary,
      startTime,
      endTime,
    });
    setShowForm(false);
    setSelectedIssue(null);
    setStartTime('09:00');
    setEndTime('09:30');
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <Repeat size={14} className="text-muted-foreground" />
            {t('smartWorklog.routineTasks')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('smartWorklog.routineTasks_desc')}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="shrink-0">
          <Plus size={14} className="mr-1" />
          <span className="hidden sm:inline">{t('smartWorklog.addRoutineTask')}</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <IssueSearchSelect
            value={selectedIssue}
            onChange={setSelectedIssue}
            placeholder={t('smartWorklog.searchTask')}
            className="h-9 text-sm"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <TimePicker value={startTime} onChange={setStartTime} />
            <span className="text-sm text-muted-foreground">–</span>
            <TimePicker value={endTime} onChange={setEndTime} />
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!selectedIssue || startTime >= endTime}
              className="ml-auto"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Task list */}
      {routineTasks.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground italic">No routine tasks added</p>
      )}

      {routineTasks.length > 0 && (
        <div className="space-y-1.5">
          {routineTasks.map((task) => {
            const [sh, sm] = task.startTime.split(':').map(Number);
            const [eh, em] = task.endTime.split(':').map(Number);
            const dur = ((eh * 60 + em - sh * 60 - sm) / 60).toFixed(1);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-medium text-foreground shrink-0">{task.issueKey}</span>
                  {task.issueSummary && (
                    <span className="text-muted-foreground truncate text-xs flex-1">
                      {task.issueSummary}
                    </span>
                  )}
                  <span className="text-muted-foreground shrink-0 text-xs font-mono">
                    {task.startTime} – {task.endTime}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                    {dur}h
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeRoutineTask(task.id)}
                  className="ml-3 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
