import { SessionNotFoundError } from './errors';
import { getSession, setSessionStatus } from './session-store';
import type { CreateAllResponse } from './types';

export async function retryCreate(
  sessionId: string,
  onlyFailed = false,
): Promise<{ total: number }> {
  const session = getSession(sessionId);
  if (!session) {
    throw new SessionNotFoundError();
  }

  if (session.status === 'completed') {
    return { total: 0 };
  }

  if (onlyFailed) {
    const failedIndices: number[] = [];
    for (let i = 0; i < session.plan.length; i++) {
      if (session.results[i]?.status === 'failed') {
        failedIndices.push(i);
      }
    }

    const newPlan = failedIndices.map((i) => session.plan[i]);

    session.plan = newPlan;
    session.currentIndex = 0;
    session.results = session.results.filter((r) => r.status !== 'failed');
  }

  setSessionStatus(sessionId, 'running');

  return { total: session.plan.length - session.currentIndex };
}

export function buildRetryResponse(sessionId: string): CreateAllResponse {
  const session = getSession(sessionId);
  if (!session) {
    throw new SessionNotFoundError();
  }

  const results = session.results;
  const succeeded = results.filter((r) => r.status === 'created').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const totalHours = results.reduce((sum, r) => sum + r.hours, 0);

  return {
    sessionId,
    total: session.plan.length,
    succeeded,
    failed,
    skipped,
    totalHours: Math.round(totalHours * 100) / 100,
    results,
    status: session.status,
    stoppedAt: session.stoppedAt ?? undefined,
  };
}
