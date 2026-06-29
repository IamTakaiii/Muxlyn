import { PieChart, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useIssueSearch } from '../../api/search';
import { usePlannerStore } from '../../state/planner-store';

const MAX_TASKS = 20;

export function DistributeTaskEditor() {
  const { t } = useTranslation();
  const distributeTasks = usePlannerStore((s) => s.distributeTasks);
  const addDistributeTask = usePlannerStore((s) => s.addDistributeTask);
  const updateDistributeTask = usePlannerStore((s) => s.updateDistributeTask);
  const removeDistributeTask = usePlannerStore((s) => s.removeDistributeTask);
  const autoDistribute = usePlannerStore((s) => s.autoDistribute);

  const [showForm, setShowForm] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<{
    id: string;
    key: string;
  } | null>(null);

  const { data: issueResult } = useIssueSearch(
    searchQ.length >= 2 ? { freeText: searchQ, pageSize: 10 } : null,
  );

  const totalPct = distributeTasks.reduce((sum, t) => sum + t.percentage, 0);
  const isValid = Math.abs(totalPct - 100) <= 0.5;

  function handleAdd() {
    if (distributeTasks.length >= MAX_TASKS) return;

    const rawKey = searchQ.trim();
    if (!selectedIssue && !rawKey) return;

    addDistributeTask({
      id: '',
      issueId: selectedIssue?.id ?? rawKey,
      issueKey: selectedIssue?.key ?? rawKey,
      percentage: 0,
    });
    setSearchQ('');
    setSelectedIssue(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <PieChart size={14} className="text-muted-foreground" />
            {t('smartWorklog.distributeTasks')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('smartWorklog.distributeTasks_desc')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Total badge */}
          {distributeTasks.length > 0 && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                isValid
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {totalPct.toFixed(0)}%
            </span>
          )}
          {distributeTasks.length > 0 && (
            <Button size="sm" variant="ghost" onClick={autoDistribute}>
              Auto
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(true)}
            disabled={distributeTasks.length >= MAX_TASKS}
          >
            <Plus size={14} className="mr-1" />
            {t('smartWorklog.addDistributeTask')}
          </Button>
        </div>
      </div>

      {/* Add form */}
      {(showForm || distributeTasks.length === 0) && distributeTasks.length < MAX_TASKS && (
        <div className="flex gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="text"
              value={selectedIssue ? selectedIssue.key : searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
                setSelectedIssue(null);
              }}
              placeholder={t('smartWorklog.searchTask')}
              className="h-9 text-sm"
            />
            {!selectedIssue && issueResult?.items && (
              <div className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
                {issueResult.items
                  .filter((issue) => !issue.isSubtask)
                  .map((issue) => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => {
                        setSelectedIssue({ id: issue.id, key: issue.key });
                        setSearchQ(issue.key);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                    >
                      <span className="font-medium">{issue.key}</span>{' '}
                      <span className="text-muted-foreground">{issue.summary}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
          <Button size="sm" onClick={handleAdd} disabled={!selectedIssue && !searchQ.trim()}>
            {t('smartWorklog.addDistributeTask')}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {distributeTasks.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground italic">No distribute tasks added</p>
      )}

      {/* Validation message */}
      {distributeTasks.length > 0 && !isValid && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {t('smartWorklog.allocationError', { percent: totalPct.toFixed(0) })}
        </p>
      )}

      {/* Task list */}
      {distributeTasks.length > 0 && (
        <div className="space-y-1.5">
          {distributeTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm"
            >
              <span className="font-medium text-foreground shrink-0 w-24 truncate">
                {task.issueKey}
              </span>

              {/* Slider */}
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={task.percentage}
                  onChange={(e) =>
                    updateDistributeTask(task.id, {
                      percentage: Number(e.target.value),
                    })
                  }
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                {/* Number input for direct edit */}
                <div className="flex items-center gap-0.5">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={task.percentage}
                    onChange={(e) =>
                      updateDistributeTask(task.id, {
                        percentage: Math.min(100, Math.max(0, Number(e.target.value))),
                      })
                    }
                    className="h-7 w-14 text-right text-sm px-2 tabular-nums"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeDistributeTask(task.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
