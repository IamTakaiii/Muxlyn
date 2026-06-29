import type { CreateSessionState, CreateSessionStatus } from './types';

const SESSION_TTL_MS = 10 * 60 * 1000;

const sessions = new Map<string, CreateSessionState>();

export function createSession(state: Omit<CreateSessionState, 'startedAt'>): CreateSessionState {
  const full: CreateSessionState = {
    ...state,
    startedAt: Date.now(),
  };
  sessions.set(state.sessionId, full);
  return full;
}

export function getSession(sessionId: string): CreateSessionState | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;

  if (Date.now() - session.startedAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return undefined;
  }

  return session;
}

export function updateSession(
  sessionId: string,
  updates: Partial<CreateSessionState>,
): CreateSessionState | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;

  Object.assign(session, updates);
  return session;
}

export function setSessionStatus(
  sessionId: string,
  status: CreateSessionStatus,
  stoppedAt?: string,
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.status = status;
  if (stoppedAt !== undefined) {
    session.stoppedAt = stoppedAt;
  }
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.startedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

setInterval(cleanupExpiredSessions, 60000);
