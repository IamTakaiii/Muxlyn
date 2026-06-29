import { sql } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { db } from '../../data/postgres';
import { authMiddleware } from '../../shared/auth/middleware';
import { getClientIp } from '../../shared/get-client-ip';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const rememberMeRoutes = new Elysia({ prefix: '/api/auth' }).use(authMiddleware).post(
  '/remember-me',
  async ({ session, request, set }) => {
    const newExpiresAt = new Date(Date.now() + SEVEN_DAYS_MS);
    const clientIp = getClientIp(request);

    await db.execute(
      sql`UPDATE "session"
            SET "expiresAt" = ${newExpiresAt},
                "remember_me" = true,
                "remembered_ip" = ${clientIp || null}
            WHERE token = ${session.token}`,
    );

    set.status = 200;
    return {
      success: true,
      message: 'Remember me enabled',
    };
  },
  {
    detail: {
      tags: ['Custom Auth'],
      summary: 'Enable remember me',
      description: 'Extends the current session to 7 days and enables IP-based persistence.',
    },
    body: t.Object({
      enable: t.Boolean({ examples: [true] }),
    }),
    response: {
      200: t.Object({
        success: t.Boolean({ examples: [true] }),
        message: t.String({ examples: ['Remember me enabled'] }),
      }),
      401: t.Object({
        success: t.Boolean({ examples: [false] }),
        message: t.String({ examples: ['Not authenticated'] }),
        error: t.Object({ code: t.String({ examples: ['UNAUTHORIZED'] }) }),
      }),
    },
  },
);
