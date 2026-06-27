export function buildCallbackURL(returnTo: string | null): string {
  const safeReturnTo = returnTo && /^\/[^\s]*$/.test(returnTo) ? returnTo : null;

  return safeReturnTo
    ? `${window.location.origin}/login/callback?return_to=${encodeURIComponent(safeReturnTo)}`
    : `${window.location.origin}/login/callback`;
}

export function validatePassword(password: string, confirm: string): string | null {
  if (password !== confirm) return 'sign_up.password_mismatch';
  if (password.length < 8) return 'sign_up.password_short';
  return null;
}
