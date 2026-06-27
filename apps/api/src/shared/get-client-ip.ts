export function getClientIp(request: Request): string {
  return request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || '';
}
