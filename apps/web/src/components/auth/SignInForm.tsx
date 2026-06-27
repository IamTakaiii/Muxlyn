import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authClient } from '@/api/client';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildCallbackURL } from '@/lib/auth';

interface Props {
  returnTo: string | null;
}

export function SignInForm({ returnTo }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: buildCallbackURL(returnTo),
    });

    if (result.error) {
      if (result.error.status === 403) {
        setError('Please verify your email address before signing in.');
      } else {
        setError('Invalid email or password.');
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="signin-email">
          Email
        </label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="signin-password">
          Password
        </label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="rounded border-input"
        />
        Remember me for 7 days
      </label>
      {error && <ErrorMessage message={error} />}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
      <Link
        to="/forgot-password"
        className="block text-center text-sm text-primary hover:underline"
      >
        Forgot password?
      </Link>
    </form>
  );
}
