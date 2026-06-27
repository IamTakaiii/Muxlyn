import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authClient } from '@/api/client';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (result.error) {
      setError(result.error.message || 'Failed to send reset email.');
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {sent ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
                If an account exists for {email}, a password reset link has been sent.
              </div>
              <Link to="/login" className="text-sm text-primary hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="reset-email">
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <ErrorMessage message={error} />}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Link to="/login" className="block text-center text-sm text-primary hover:underline">
                Back to login
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
