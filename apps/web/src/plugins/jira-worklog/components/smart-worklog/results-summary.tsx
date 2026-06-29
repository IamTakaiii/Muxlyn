import { CheckCircle, SkipForward, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CreateAllResponse, CreateResultItem } from '../../api/smart-worklog';

interface Props {
  result: CreateAllResponse;
}

function StatusIcon({ status }: { status: CreateResultItem['status'] }) {
  switch (status) {
    case 'created':
      return <CheckCircle size={14} className="text-green-600" />;
    case 'skipped':
      return <SkipForward size={14} className="text-amber-600" />;
    case 'failed':
      return <XCircle size={14} className="text-red-600" />;
  }
}

export function ResultsSummary({ result }: Props) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 text-sm font-medium">
        {t('smartWorklog.resultSummary', {
          created: result.succeeded,
          skipped: result.skipped,
          failed: result.failed,
          hours: result.totalHours,
          interpolation: { escapeValue: false },
        })}
      </h3>

      <div className="max-h-[300px] space-y-1 overflow-y-auto">
        {result.results.map((item) => (
          <div
            key={`${item.date}-${item.issueId}-${item.status}`}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs ${
              item.status === 'failed'
                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                : ''
            }`}
          >
            <StatusIcon status={item.status} />
            <span className="font-medium">{item.issueKey}</span>
            <span className="text-muted-foreground">{item.date}</span>
            <span className="text-muted-foreground">{item.hours}h</span>
            {item.error && <span className="text-red-600">{item.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
