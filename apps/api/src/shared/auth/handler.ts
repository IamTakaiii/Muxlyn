import { Elysia, t } from 'elysia';
import { UnauthorizedError } from '../errors';
import { auth } from './auth';

export const authHandler = new Elysia()
  .all('/auth/api/*', ({ request }) => auth.handler(request))
  .get(
    '/api/auth/me',
    async ({ request }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        throw new UnauthorizedError();
      }

      return {
        success: true,
        message: 'ok',
        data: {
          user: session.user,
          session: {
            id: session.session.id,
            expiresAt: session.session.expiresAt,
          },
        },
      };
    },
    {
      detail: {
        tags: ['Custom Auth'],
        summary: 'Get current session',
        description: 'Returns the authenticated user and session info.',
      },
      response: {
        200: t.Object({
          success: t.Boolean({ examples: [true] }),
          message: t.String({ examples: ['ok'] }),
          data: t.Object({
            user: t.Object({
              id: t.String(),
              name: t.String(),
              email: t.String(),
              image: t.Optional(t.Nullable(t.String())),
            }),
            session: t.Object({
              id: t.String(),
              expiresAt: t.Date(),
            }),
          }),
        }),
        401: t.Object({
          success: t.Boolean(),
          message: t.String(),
          error: t.Object({ code: t.String() }),
        }),
      },
    },
  );
