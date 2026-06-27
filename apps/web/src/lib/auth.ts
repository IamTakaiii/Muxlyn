export function buildCallbackURL(returnTo: string | null): string {
  return returnTo
    ? `${window.location.origin}/login/callback?return_to=${encodeURIComponent(returnTo)}`
    : `${window.location.origin}/login/callback`;
}

export function validatePassword(password: string, confirm: string): string | null {
  if (password !== confirm) return 'Passwords do not match.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}
