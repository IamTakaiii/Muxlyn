import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { type CreateAllResponse, useRetry } from '../../api/smart-worklog';

interface Props {
  sessionId: string;
  status: string;
  onResult: (result: CreateAllResponse) => void;
}

export function RetryDialog({ sessionId, status, onResult }: Props) {
  const { t } = useTranslation();
  const retryMutation = useRetry();
  const [retrying, setRetrying] = useState(false);

  if (status === 'completed') return null;
  if (retrying) {
    return (
      <div className="text-center text-sm text-muted-foreground py-2">
        {t('smartWorklog.retry')}...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{t('smartWorklog.retry_desc')}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            setRetrying(true);
            retryMutation.mutate(
              { sessionId, onlyFailed: false },
              {
                onSuccess: (res) => {
                  if (res.success && res.data) {
                    onResult(res.data);
                  }
                  setRetrying(false);
                },
                onError: () => setRetrying(false),
              },
            );
          }}
        >
          {t('smartWorklog.retryAll')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRetrying(true);
            retryMutation.mutate(
              { sessionId, onlyFailed: true },
              {
                onSuccess: (res) => {
                  if (res.success && res.data) {
                    onResult(res.data);
                  }
                  setRetrying(false);
                },
                onError: () => setRetrying(false),
              },
            );
          }}
        >
          {t('smartWorklog.retryFailed')}
        </Button>
      </div>
    </div>
  );
}
