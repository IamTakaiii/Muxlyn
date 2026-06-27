import type { ApiResponse } from '@muxlyn/shared';
import { createAuthClient } from 'better-auth/react';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  basePath: '/auth/api',
});

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const sessionWarning = response.headers.get('X-Session-Warning');
  if (sessionWarning === 'expiring') {
    window.dispatchEvent(
      new CustomEvent('toast:show', {
        detail: {
          message: 'Your session will expire in 5 minutes. Continue working to stay logged in.',
          variant: 'warning',
        },
      }),
    );
  }

  const body = await response.json().catch(() => null);

  if (response.status === 401) {
    const errorCode = body?.error?.code;

    if (errorCode === 'SESSION_EXPIRED') {
      window.dispatchEvent(new CustomEvent('session:expired'));
    } else if (errorCode === 'IP_CHANGED') {
      window.dispatchEvent(new CustomEvent('session:ipChanged'));
    }
  }

  return body;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string) =>
    request<T>(url, {
      method: 'DELETE',
    }),
};
