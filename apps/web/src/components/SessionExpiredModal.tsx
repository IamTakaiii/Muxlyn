import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function SessionExpiredModal() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handle = () => setVisible(true);
    window.addEventListener('session:expired', handle);
    return () => window.removeEventListener('session:expired', handle);
  }, []);

  if (!visible) return null;

  const handleOk = () => {
    setVisible(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
              <svg
                className="h-5 w-5 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Warning</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Session Expired</h3>
              <p className="text-sm text-muted-foreground">
                Your session has expired. Your work has been saved locally.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleOk}>Go to Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
