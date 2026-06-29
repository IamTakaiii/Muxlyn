import { sql } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { db } from '../../data/postgres';
import { t as i18n } from '../../shared/i18n';
import { success } from '../../shared/response';

const okResponse = t.Object({
  success: t.Boolean({ examples: [true] }),
  message: t.String({ examples: ['OK'] }),
});

export const healthModule = new Elysia({ prefix: '/health' })
  .get('/', () => success(i18n('health.ok')), {
    detail: { tags: ['Health'], summary: 'Health check', description: 'Basic liveness check.' },
    response: { 200: okResponse },
  })
  .get('/live', () => success(i18n('health.live')), {
    detail: { tags: ['Health'], summary: 'Liveness probe', description: 'Kubernetes liveness.' },
    response: { 200: okResponse },
  })
  .get(
    '/ready',
    async ({ set }) => {
      try {
        await db.execute(sql`SELECT 1`);
        return success(i18n('health.ready'));
      } catch {
        set.status = 503;
        return success(i18n('error.service_unavailable'));
      }
    },
    {
      detail: {
        tags: ['Health'],
        summary: 'Readiness probe',
        description: 'Checks database connectivity for Kubernetes readiness.',
      },
      response: { 200: okResponse, 503: okResponse },
    },
  );
