import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../shared/auth/middleware';
import { createAll } from './create-service';
import { dryRun } from './dry-run-service';
import { PreflightError, SessionNotFoundError } from './errors';
import { buildRetryResponse, retryCreate } from './retry-service';
import { getSession } from './session-store';
import type { CreateStatusResponse, PlannerInput } from './types';

const routineTaskSchema = t.Object({
  issueId: t.String(),
  startTime: t.String(),
  endTime: t.String(),
});

const distributeTaskSchema = t.Object({
  issueId: t.String(),
  percentage: t.Number({ minimum: 0, maximum: 100 }),
});

const plannerBody = t.Object({
  year: t.Number(),
  month: t.Number({ minimum: 1, maximum: 12 }),
  holidays: t.Array(t.String()),
  dailyHours: t.Number({ minimum: 0.25, maximum: 24 }),
  routineTasks: t.Array(routineTaskSchema),
  distributeTasks: t.Array(distributeTaskSchema),
  holidayTaskIssueId: t.Optional(t.String()),
  language: t.Optional(t.Union([t.Literal('en'), t.Literal('th')])),
});

export const smartWorklogRoutes = new Elysia({ prefix: '/api/smart-worklog' })
  .use(authMiddleware)

  .post(
    '/dry-run',
    async ({ user, body, set }) => {
      try {
        const result = await dryRun(user.id, body as PlannerInput);
        return { success: true, message: 'ok', data: result };
      } catch (error) {
        if (error instanceof PreflightError) {
          set.status = 422;
          return {
            success: false,
            message: error.message,
            error: {
              code: error.code,
              details: error.details,
            },
          };
        }
        throw error;
      }
    },
    {
      detail: {
        tags: ['Smart Worklog'],
        summary: 'Dry-run worklog creation plan',
        description: 'Computes a full month worklog plan without creating anything.',
      },
      body: plannerBody,
    },
  )

  .post(
    '/create',
    async ({ user, body, set }) => {
      try {
        const input = body as PlannerInput;
        const { sessionId, total } = await createAll(user.id, user.id, input);
        return {
          success: true,
          message: 'ok',
          data: { sessionId, total, status: 'processing' },
        };
      } catch (error) {
        if (error instanceof PreflightError) {
          set.status = 422;
          return {
            success: false,
            message: error.message,
            error: {
              code: error.code,
              details: error.details,
            },
          };
        }
        throw error;
      }
    },
    {
      detail: {
        tags: ['Smart Worklog'],
        summary: 'Start creating all worklogs',
        description:
          'Initiates sequential worklog creation. Returns immediately with sessionId. Poll /status for progress.',
      },
      body: plannerBody,
    },
  )

  .get(
    '/create/status',
    ({ query }) => {
      const session = getSession(query.sessionId);
      if (!session) {
        throw new SessionNotFoundError();
      }

      const planItems = session.plan as unknown as {
        issueId: string;
        issueKey: string;
        date: string;
        hours: number;
        startTime: string;
      }[];
      const currentItem =
        session.currentIndex < planItems.length ? planItems[session.currentIndex] : null;

      const response: CreateStatusResponse = {
        sessionId: session.sessionId,
        total: session.plan.length,
        completed: session.currentIndex,
        currentDate: currentItem?.date,
        currentIssueKey: currentItem?.issueKey,
        status: session.status,
        errors: session.results.filter((r) => r.status === 'failed').length,
      };

      return { success: true, message: 'ok', data: response };
    },
    {
      detail: {
        tags: ['Smart Worklog'],
        summary: 'Get creation progress',
        description: 'Returns current progress of a creation session.',
      },
      query: t.Object({
        sessionId: t.String(),
      }),
    },
  )

  .post(
    '/create/retry',
    async ({ body }) => {
      await retryCreate(body.sessionId, body.onlyFailed ?? false);
      const result = buildRetryResponse(body.sessionId);
      return { success: true, message: 'ok', data: result };
    },
    {
      detail: {
        tags: ['Smart Worklog'],
        summary: 'Retry failed worklogs',
        description: 'Retries failed or all remaining worklogs from a previous creation session.',
      },
      body: t.Object({
        sessionId: t.String(),
        onlyFailed: t.Optional(t.Boolean()),
      }),
    },
  );
