import { useCallback, useEffect, useRef } from 'react';

const DRAFT_PREFIX = 'muxlyn:draft:';

function draftKey(route: string): string {
  return `${DRAFT_PREFIX}${route}`;
}

export function useDraftSave(route: string, getFormState: () => Record<string, unknown>) {
  const getFormStateRef = useRef(getFormState);
  getFormStateRef.current = getFormState;

  useEffect(() => {
    const handleSessionExpired = () => {
      const state = getFormStateRef.current();
      const hasValues = Object.values(state).some((v) => v !== undefined && v !== null && v !== '');
      if (hasValues) {
        localStorage.setItem(draftKey(route), JSON.stringify(state));
      }
    };

    window.addEventListener('session:expired', handleSessionExpired);
    return () => window.removeEventListener('session:expired', handleSessionExpired);
  }, [route]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey(route));
  }, [route]);

  const getDraft = useCallback((): Record<string, unknown> | null => {
    const raw = localStorage.getItem(draftKey(route));
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [route]);

  return { getDraft, clearDraft };
}
