import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

export function useSwitchConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/jira/connections/${id}/switch`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jira', 'connections'] }),
  });
}

export function useUpdateToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, api_token }: { id: string; api_token: string }) =>
      api.put(`/api/jira/connections/${id}/token`, { api_token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jira', 'connections'] }),
  });
}

export function useDisconnectConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/jira/connections/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jira', 'connections'] }),
  });
}

export function useConnectJira() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { jira_url: string; api_token: string }) =>
      api.post('/api/jira/connections', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jira', 'connections'] }),
  });
}
