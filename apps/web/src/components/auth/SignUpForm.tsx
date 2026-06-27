import { useState } from 'react';
import { authClient } from '@/api/client';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildCallbackURL, validatePassword } from '@/lib/auth';

interface Props {
  returnTo: string | null;
}

export function SignUpForm({ returnTo }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pwError = validatePassword(password, confirm);
    if (pwError) {
      setError(pwError);
      return;
    }

    setLoading(true);

    const result = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: buildCallbackURL(returnTo),
    });

    if (result.error) {
      setError(result.error.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="signup-name">
          Name
        </label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="signup-email">
          Email
        </label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="signup-password">
          Password
        </label>
        <Input
          id="signup-password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="signup-confirm">
          Confirm Password
        </label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="Confirm your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      {error && <ErrorMessage message={error} />}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}
