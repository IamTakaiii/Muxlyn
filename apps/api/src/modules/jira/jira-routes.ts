import { and, eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { getEnv } from '../../config/env';
import { db } from '../../data/postgres';
import { jiraConnections } from '../../data/schema';
import { authMiddleware } from '../../shared/auth/middleware';
import { JiraDuplicateError, NotFoundError } from '../../shared/errors';
import { encryptToken, extractAvatarUrl, validateJiraToken } from './jira-service';

const env = getEnv();

// ── OpenAPI schemas ──────────────────────────────────────────────

const connectionFields = {
  id: t.String({ examples: ['550e8400-e29b-41d4-a716-446655440000'] }),
  jira_url: t.String({ examples: ['https://mycompany.atlassian.net'] }),
  jira_account_id: t.String({ examples: ['712020:abcd-efgh-ijkl'] }),
  display_name: t.String({ examples: ['John Doe'] }),
  email: t.String({ examples: ['john@company.com'] }),
  avatar_url: t.String({ examples: ['https://avatar.url/48.png'] }),
  is_active: t.Boolean({ examples: [true] }),
  status: t.String({ examples: ['connected'] }),
  last_validated_at: t.String({ examples: ['2026-06-27T10:00:00.000Z'] }),
};

const connectionSchema = t.Object(connectionFields);
const connectionWithCreatedAt = t.Object({
  ...connectionFields,
  created_at: t.String({ examples: ['2026-06-27T10:00:00.000Z'] }),
});

const successResponse = (dataSchema: ReturnType<typeof t.Object>) =>
  t.Object({
    success: t.Boolean({ examples: [true] }),
    message: t.String({ examples: ['ok'] }),
    data: dataSchema,
  });

const errorResponse = t.Object({
  success: t.Boolean({ examples: [false] }),
  message: t.String({ examples: ['Error description'] }),
  error: t.Object({
    code: t.String({ examples: ['ERROR_CODE'] }),
    details: t.Optional(t.Record(t.String(), t.Unknown())),
  }),
});

// ── Helpers ──────────────────────────────────────────────────────

type ConnectionRow = {
  id: string;
  jiraUrl: string;
  jiraAccountId: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean | null;
  status: string | null;
  lastValidatedAt: Date | null;
  createdAt?: Date | null;
};

function toApiConnection(c: ConnectionRow) {
  return {
    id: c.id,
    jira_url: c.jiraUrl,
    jira_account_id: c.jiraAccountId,
    display_name: c.displayName,
    email: c.email,
    avatar_url: c.avatarUrl,
    is_active: c.isActive,
    status: c.status,
    last_validated_at: c.lastValidatedAt,
    created_at: c.createdAt,
  };
}

// ── Routes ───────────────────────────────────────────────────────

export const jiraRoutes = new Elysia({ prefix: '/api/jira' })
  .use(authMiddleware)

  // POST /connect
  .post(
    '/connect',
    async ({ body, user, set }) => {
      const jiraUser = await validateJiraToken(body.jira_url, body.api_token, user.email);

      const existing = await db
        .select({ id: jiraConnections.id })
        .from(jiraConnections)
        .where(
          and(
            eq(jiraConnections.userId, user.id),
            eq(jiraConnections.jiraAccountId, jiraUser.accountId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        throw new JiraDuplicateError();
      }

      const encrypted = await encryptToken(body.api_token, env.ENCRYPTION_KEY);

      const existingConnections = await db
        .select({ id: jiraConnections.id })
        .from(jiraConnections)
        .where(eq(jiraConnections.userId, user.id))
        .limit(1);

      const isFirst = existingConnections.length === 0;

      const [connection] = await db
        .insert(jiraConnections)
        .values({
          userId: user.id,
          jiraUrl: body.jira_url.trim().replace(/\/+$/, ''),
          jiraAccountId: jiraUser.accountId,
          displayName: jiraUser.displayName,
          email: jiraUser.emailAddress,
          avatarUrl: extractAvatarUrl(jiraUser.avatarUrls),
          apiTokenEncrypted: encrypted,
          isActive: isFirst,
          status: 'connected',
          lastValidatedAt: new Date(),
        })
        .returning({
          id: jiraConnections.id,
          jiraUrl: jiraConnections.jiraUrl,
          jiraAccountId: jiraConnections.jiraAccountId,
          displayName: jiraConnections.displayName,
          email: jiraConnections.email,
          avatarUrl: jiraConnections.avatarUrl,
          isActive: jiraConnections.isActive,
          status: jiraConnections.status,
          lastValidatedAt: jiraConnections.lastValidatedAt,
          createdAt: jiraConnections.createdAt,
        });

      set.status = 201;
      return {
        success: true,
        message: 'Jira account connected',
        data: { connection: toApiConnection(connection) },
      };
    },
    {
      detail: {
        tags: ['Jira'],
        summary: 'Connect a Jira account',
        description: 'Validates the API token against Jira and stores the encrypted connection.',
      },
      body: t.Object({
        jira_url: t.String({ examples: ['https://mycompany.atlassian.net'] }),
        api_token: t.String({ examples: ['ATATT3...xyz'] }),
      }),
      response: {
        201: successResponse(t.Object({ connection: connectionWithCreatedAt })),
        400: errorResponse,
        401: errorResponse,
        409: errorResponse,
      },
    },
  )

  // GET /connections
  .get(
    '/connections',
    async ({ user }) => {
      const connections = await db
        .select()
        .from(jiraConnections)
        .where(eq(jiraConnections.userId, user.id))
        .orderBy(jiraConnections.createdAt);

      return {
        success: true,
        message: 'ok',
        data: { connections: connections.map(toApiConnection) },
      };
    },
    {
      detail: {
        tags: ['Jira'],
        summary: 'List Jira connections',
        description: 'Returns all Jira connections for the authenticated user.',
      },
      response: {
        200: successResponse(t.Object({ connections: t.Array(connectionSchema) })),
        401: errorResponse,
      },
    },
  )

  // GET /connections/active
  .get(
    '/connections/active',
    async ({ user }) => {
      const [connection] = await db
        .select()
        .from(jiraConnections)
        .where(and(eq(jiraConnections.userId, user.id), eq(jiraConnections.isActive, true)))
        .limit(1);

      if (!connection) {
        throw new NotFoundError();
      }

      return {
        success: true,
        message: 'ok',
        data: { connection: toApiConnection(connection) },
      };
    },
    {
      detail: {
        tags: ['Jira'],
        summary: 'Get active Jira connection',
        description: 'Returns the currently active Jira connection for the user.',
      },
      response: {
        200: successResponse(t.Object({ connection: connectionSchema })),
        401: errorResponse,
        404: errorResponse,
      },
    },
  )

  // PUT /connections/:id/token
  .put(
    '/connections/:id/token',
    async ({ params, body, user }) => {
      const [existing] = await db
        .select({ id: jiraConnections.id, jiraUrl: jiraConnections.jiraUrl })
        .from(jiraConnections)
        .where(and(eq(jiraConnections.id, params.id), eq(jiraConnections.userId, user.id)))
        .limit(1);

      if (!existing) {
        throw new NotFoundError();
      }

      const jiraUser = await validateJiraToken(existing.jiraUrl, body.api_token, user.email);
      const encrypted = await encryptToken(body.api_token, env.ENCRYPTION_KEY);

      const [updated] = await db
        .update(jiraConnections)
        .set({
          apiTokenEncrypted: encrypted,
          displayName: jiraUser.displayName,
          email: jiraUser.emailAddress,
          avatarUrl: extractAvatarUrl(jiraUser.avatarUrls),
          status: 'connected',
          lastValidatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(jiraConnections.id, params.id))
        .returning({
          id: jiraConnections.id,
          jiraUrl: jiraConnections.jiraUrl,
          jiraAccountId: jiraConnections.jiraAccountId,
          displayName: jiraConnections.displayName,
          email: jiraConnections.email,
          avatarUrl: jiraConnections.avatarUrl,
          isActive: jiraConnections.isActive,
          status: jiraConnections.status,
          lastValidatedAt: jiraConnections.lastValidatedAt,
        });

      return {
        success: true,
        message: 'API token updated',
        data: { connection: toApiConnection(updated) },
      };
    },
    {
      detail: {
        tags: ['Jira'],
        summary: 'Update Jira API token',
        description:
          'Re-validates the new token against Jira and updates the stored encrypted token.',
      },
      body: t.Object({
        api_token: t.String({ examples: ['ATATT3...new_token'] }),
      }),
      response: {
        200: successResponse(t.Object({ connection: connectionSchema })),
        400: errorResponse,
        401: errorResponse,
        404: errorResponse,
      },
    },
  )

  // POST /connections/:id/switch
  .post(
    '/connections/:id/switch',
    async ({ params, user }) => {
      const [existing] = await db
        .select({ id: jiraConnections.id })
        .from(jiraConnections)
        .where(and(eq(jiraConnections.id, params.id), eq(jiraConnections.userId, user.id)))
        .limit(1);

      if (!existing) {
        throw new NotFoundError();
      }

      await db.transaction(async (tx) => {
        await tx
          .update(jiraConnections)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(jiraConnections.userId, user.id));

        await tx
          .update(jiraConnections)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(jiraConnections.id, params.id));
      });

      const [updated] = await db
        .select()
        .from(jiraConnections)
        .where(eq(jiraConnections.id, params.id));

      return {
        success: true,
        message: 'Active Jira account switched',
        data: { connection: toApiConnection(updated) },
      };
    },
    {
      detail: {
        tags: ['Jira'],
        summary: 'Switch active Jira account',
        description: 'Sets the specified Jira connection as active and deactivates all others.',
      },
      response: {
        200: successResponse(t.Object({ connection: connectionSchema })),
        401: errorResponse,
        404: errorResponse,
      },
    },
  )

  // DELETE /connections/:id
  .delete(
    '/connections/:id',
    async ({ params, user, set }) => {
      const [existing] = await db
        .select({ id: jiraConnections.id, isActive: jiraConnections.isActive })
        .from(jiraConnections)
        .where(and(eq(jiraConnections.id, params.id), eq(jiraConnections.userId, user.id)))
        .limit(1);

      if (!existing) {
        throw new NotFoundError();
      }

      await db.delete(jiraConnections).where(eq(jiraConnections.id, params.id));

      if (existing.isActive) {
        const [nextActive] = await db
          .select({ id: jiraConnections.id })
          .from(jiraConnections)
          .where(eq(jiraConnections.userId, user.id))
          .orderBy(jiraConnections.createdAt)
          .limit(1);

        if (nextActive) {
          await db
            .update(jiraConnections)
            .set({ isActive: true, updatedAt: new Date() })
            .where(eq(jiraConnections.id, nextActive.id));
        }
      }

      set.status = 204;
      return null;
    },
    {
      detail: {
        tags: ['Jira'],
        summary: 'Disconnect Jira account',
        description: 'Removes the Jira connection. Does NOT delete Worklogs on Jira.',
      },
      response: {
        204: t.Void(),
        401: errorResponse,
        404: errorResponse,
      },
    },
  );
