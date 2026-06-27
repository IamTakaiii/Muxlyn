import { useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { JiraConnection } from './types';

interface Props {
  connections: JiraConnection[];
  onUpdate: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  connected: 'Connected',
  token_expired: 'Token Expired',
  token_revoked: 'Token Revoked',
};

const STATUS_COLORS: Record<string, string> = {
  connected: 'text-green-600',
  token_expired: 'text-yellow-600',
  token_revoked: 'text-red-600',
};

export function ConnectionList({ connections, onUpdate }: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newToken, setNewToken] = useState('');
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleSwitch = async (id: string) => {
    await api.post(`/api/jira/connections/${id}/switch`);
    onUpdate();
  };

  const handleUpdateToken = async (id: string) => {
    if (!newToken) return;
    await api.put(`/api/jira/connections/${id}/token`, { api_token: newToken });
    setUpdatingId(null);
    setNewToken('');
    onUpdate();
  };

  const handleDisconnect = async (id: string) => {
    await api.delete(`/api/jira/connections/${id}`);
    setDisconnectingId(null);
    onUpdate();
  };

  return (
    <div className="space-y-3">
      {connections.map((conn) => (
        <Card key={conn.id} className={conn.is_active ? 'border-primary' : ''}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {conn.avatar_url && (
                <img src={conn.avatar_url} alt="" className="h-8 w-8 rounded-full" />
              )}
              <div>
                <p className="font-medium">{conn.display_name}</p>
                <p className="text-sm text-muted-foreground">{conn.email}</p>
                <p className="text-xs text-muted-foreground">{conn.jira_url}</p>
                <span className={`text-xs font-medium ${STATUS_COLORS[conn.status]}`}>
                  {STATUS_LABELS[conn.status]}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {conn.is_active ? (
                <span className="text-xs font-medium text-primary">Active</span>
              ) : (
                <Button size="sm" variant="outline" onClick={() => handleSwitch(conn.id)}>
                  Switch
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setUpdatingId(conn.id)}>
                Update Token
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setDisconnectingId(conn.id)}>
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {updatingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold">Update API Token</h3>
              <Input
                type="password"
                placeholder="New API token"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
              />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleUpdateToken(updatingId)}>
                  Save
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setUpdatingId(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {disconnectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold">Disconnect Jira Account?</h3>
              <p className="text-sm text-muted-foreground">
                This will not delete any Worklogs on Jira. You can reconnect later.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDisconnect(disconnectingId)}
                >
                  Disconnect
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDisconnectingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
