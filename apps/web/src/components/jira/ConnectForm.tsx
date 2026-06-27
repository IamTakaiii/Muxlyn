import { useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onConnected: () => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: 'Invalid API token. Please generate a new one from Jira.',
  NO_PERMISSION: 'API token lacks required permissions.',
  NETWORK_ERROR: 'Cannot connect to Jira. Please check the URL.',
  INVALID_URL: 'Invalid Jira URL. Must start with https://',
  DUPLICATE: 'This Jira account is already connected.',
};

export function ConnectForm({ onConnected }: Props) {
  const [jiraUrl, setJiraUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<{ connection: unknown }>('/api/jira/connect', {
        jira_url: jiraUrl,
        api_token: apiToken,
      });

      if (res.success) {
        setJiraUrl('');
        setApiToken('');
        onConnected();
      } else {
        const code = res.error?.code || 'NETWORK_ERROR';
        setError(ERROR_MESSAGES[code] || 'Failed to connect. Please try again.');
      }
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="jira-url">
          Jira URL
        </label>
        <Input
          id="jira-url"
          type="url"
          placeholder="https://your-company.atlassian.net"
          value={jiraUrl}
          onChange={(e) => setJiraUrl(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="api-token">
          API Token
        </label>
        <Input
          id="api-token"
          type="password"
          placeholder="Enter your Jira API token"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          required
        />
      </div>
      {error && (
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Connecting...' : 'Connect Jira Account'}
      </Button>
    </form>
  );
}
