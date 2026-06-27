import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, authClient } from '@/api/client';
import { FullPageSpinner } from '@/components/FullPageSpinner';

async function enableRememberMe() {
  const shouldRemember = localStorage.getItem('muxlyn:rememberMe');
  if (shouldRemember === 'true') {
    localStorage.removeItem('muxlyn:rememberMe');
    try {
      await api.post('/api/auth/remember-me', { enable: true });
    } catch {
      // Silently fail — user is still logged in
    }
  }
}

export function LoginCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (session) {
      const returnTo = searchParams.get('return_to');
      enableRememberMe().then(() => {
        navigate(returnTo || '/hub', { replace: true });
      });
    } else {
      const oauthError = searchParams.get('error');
      if (oauthError) {
        navigate(`/login?error=${oauthError}`, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [session, isPending, navigate, searchParams]);

  return <FullPageSpinner />;
}
