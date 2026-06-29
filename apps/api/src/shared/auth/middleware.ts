import { sql } from 'drizzle-orm';
import { Elysia } from 'elysia';
import { db } from '../../data/postgres';
import { getClientIp } from '../../shared/get-client-ip';
import { IpChangedError, SessionExpiredError, UnauthorizedError } from '../errors';
import { auth } from './auth';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const authMiddleware = new Elysia().derive({ as: 'scoped' }, async ({ request, set }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  const now = new Date();
  if (session.session.expiresAt < now) {
    throw new SessionExpiredError();
  }

  const result = await db.execute(
    sql`SELECT remember_me, remembered_ip FROM "session" WHERE token = ${session.session.token} LIMIT 1`,
  );

  const extraRow = result.rows[0] as Record<string, unknown> | undefined;
  const rememberMe = (extraRow?.remember_me as boolean) ?? false;
  const rememberedIp = (extraRow?.remembered_ip as string) ?? null;

  if (rememberMe) {
    const clientIp = getClientIp(request);
    if (rememberedIp && clientIp && rememberedIp !== clientIp) {
      await auth.api.revokeSession({
        body: { token: session.session.token },
        headers: request.headers,
      });
      throw new IpChangedError();
    }
  }

  const timeUntilExpiry = session.session.expiresAt.getTime() - now.getTime();
  if (!rememberMe && timeUntilExpiry > 0 && timeUntilExpiry <= FIVE_MINUTES_MS) {
    set.headers['X-Session-Warning'] = 'expiring';
  }

  return {
    user: session.user,
    session: {
      ...session.session,
      rememberMe,
      rememberedIp,
    },
  };
});
