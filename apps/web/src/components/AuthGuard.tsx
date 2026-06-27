import { type ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authClient } from '@/api/client';
import { FullPageSpinner } from '@/components/FullPageSpinner';

interface Props {
  children: ReactNode;
}

export function AuthGuard({ children }: Props) {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  useEffect(() => {
    if (!isPending && !session) {
      window.dispatchEvent(new CustomEvent('session:expired'));
    }
  }, [session, isPending]);

  if (isPending) return <FullPageSpinner />;

  if (!session) {
    const returnTo = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?return_to=${returnTo}`} replace />;
  }

  return <>{children}</>;
}
