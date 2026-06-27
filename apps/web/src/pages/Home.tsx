import { Navigate } from 'react-router-dom';
import { authClient } from '@/api/client';
import { FullPageSpinner } from '@/components/FullPageSpinner';

export function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <FullPageSpinner />;
  if (session) return <Navigate to="/hub" replace />;
  return <Navigate to="/login" replace />;
}
