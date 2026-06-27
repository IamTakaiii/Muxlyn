import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authClient } from '@/api/client';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildCallbackURL } from '@/lib/auth';

type AuthTab = 'google' | 'email';
type EmailMode = 'signin' | 'signup';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('google');
  const [emailMode, setEmailMode] = useState<EmailMode>('signin');

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      const returnTo = searchParams.get('return_to');
      navigate(returnTo || '/hub', { replace: true });
    }
  }, [session, navigate, searchParams]);

  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'access_denied') {
      setError('Login was not authorized. Please try again.');
    } else if (oauthError === 'cancelled') {
      setError('Login cancelled.');
    } else if (oauthError === 'ip_changed') {
      setError('Your IP address has changed. Please log in again for security.');
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    if (rememberMe) {
      localStorage.setItem('muxlyn:rememberMe', 'true');
    }

    await authClient.signIn.social({
      provider: 'google',
      callbackURL: buildCallbackURL(searchParams.get('return_to')),
    });
  };

  const returnTo = searchParams.get('return_to');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Muxlyn</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex rounded-md border">
            <button
              type="button"
              className={`flex-1 rounded-l-md px-4 py-2 text-sm font-medium ${
                authTab === 'google'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
              onClick={() => setAuthTab('google')}
            >
              Google
            </button>
            <button
              type="button"
              className={`flex-1 rounded-r-md px-4 py-2 text-sm font-medium ${
                authTab === 'email'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
              onClick={() => setAuthTab('email')}
            >
              Email
            </button>
          </div>

          {error && <ErrorMessage message={error} />}

          {authTab === 'google' ? (
            <>
              <Button onClick={handleGoogleLogin} disabled={loading} className="w-full">
                {loading ? 'Redirecting...' : 'Sign in with Google'}
              </Button>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-input"
                />
                Remember me for 7 days
              </label>
            </>
          ) : (
            <>
              {emailMode === 'signin' ? (
                <SignInForm returnTo={returnTo} />
              ) : (
                <SignUpForm returnTo={returnTo} />
              )}
              <p className="text-center text-sm text-muted-foreground">
                {emailMode === 'signin' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('signup');
                        setError(null);
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('signin');
                        setError(null);
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
