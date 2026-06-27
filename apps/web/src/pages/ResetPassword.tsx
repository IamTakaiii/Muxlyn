import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authClient } from '@/api/client';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { validatePassword } from '@/lib/auth';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const tokenError = searchParams.get('error');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(
    tokenError === 'INVALID_TOKEN' ? 'Invalid or expired reset link.' : null,
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pwError = validatePassword(password, confirm);
    if (pwError) {
      setError(pwError);
      return;
    }

    setLoading(true);

    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (result.error) {
      setError(result.error.message || 'Failed to reset password.');
    } else {
      setDone(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!token && !tokenError ? (
            <ErrorMessage message="Missing reset token. Please use the link from your email." />
          ) : done ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
                Your password has been reset successfully.
              </div>
              <Link to="/login" className="text-sm text-primary hover:underline">
                Sign in with your new password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="new-password">
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              {error && <ErrorMessage message={error} />}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
