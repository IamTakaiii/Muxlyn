import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';

export function SessionExpiredModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('session:expired', handler);
    window.addEventListener('session:ipChanged', handler);
    return () => {
      window.removeEventListener('session:expired', handler);
      window.removeEventListener('session:ipChanged', handler);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && navigate({ to: '/login', replace: true })}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('session.title')}</DialogTitle>
          <DialogDescription>{t('session.desc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => navigate({ to: '/login', replace: true })}>{t('session.go_login')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
