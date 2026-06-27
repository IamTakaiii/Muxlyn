import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { JiraConnection } from '@/features/hub/types';

export function useConnections() {
  return useQuery({
    queryKey: ['jira', 'connections'],
    queryFn: async () => {
      const res = await api.get<{ connections: JiraConnection[] }>('/api/jira/connections');
      if (!res.success) throw new Error(res.error?.code ?? 'Failed to fetch');
      return res.data?.connections ?? [];
    },
  });
}
