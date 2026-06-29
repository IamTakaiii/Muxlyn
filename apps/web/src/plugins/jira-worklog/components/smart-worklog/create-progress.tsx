import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type CreateStatusResponse, useCreateStatus } from '../../api/smart-worklog';

interface Props {
  sessionId: string;
  onComplete: (status: CreateStatusResponse) => void;
}

export function CreateProgress({ sessionId, onComplete }: Props) {
  const { t } = useTranslation();
  const { data } = useCreateStatus(sessionId);

  useEffect(() => {
    if (data && data.status !== 'running') {
      onComplete(data);
    }
  }, [data, onComplete]);

  if (!data) {
    return (
      <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
        {t('smartWorklog.creating')}
      </div>
    );
  }

  const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          {data.status === 'running' ? t('smartWorklog.creating') : ''}
        </span>
        <span className="text-sm text-muted-foreground">
          {t('smartWorklog.creating_progress', {
            current: data.completed,
            total: data.total,
          })}
        </span>
      </div>

      <div className="mb-2 h-2 w-full rounded-full bg-secondary">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      {data.status === 'running' && (
        <div className="mt-2 text-xs text-muted-foreground">
          {data.currentDate && (
            <span>
              {data.currentDate} {data.currentIssueKey && `— ${data.currentIssueKey}`}
            </span>
          )}
        </div>
      )}

      {data.status !== 'running' && (
        <div className="mt-3 flex justify-center">
          <span
            className={`text-sm font-medium ${
              data.status === 'completed'
                ? 'text-green-600'
                : data.status === 'rate_limited'
                  ? 'text-amber-600'
                  : 'text-red-600'
            }`}
          >
            {data.status === 'completed'
              ? t('smartWorklog.created')
              : data.status === 'rate_limited'
                ? t('smartWorklog.rateLimited', {
                    date: data.currentDate ?? '',
                    count: data.completed,
                  })
                : data.status === 'auth_error'
                  ? t('smartWorklog.authExpired')
                  : ''}
          </span>
        </div>
      )}
    </div>
  );
}
