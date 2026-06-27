import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, authClient } from '@/api/client';
import { AccountSwitcher } from '@/components/jira/AccountSwitcher';
import { ConnectForm } from '@/components/jira/ConnectForm';
import { ConnectionList } from '@/components/jira/ConnectionList';
import type { JiraConnection } from '@/components/jira/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HubPage() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [connections, setConnections] = useState<JiraConnection[]>([]);

  const fetchConnections = useCallback(async () => {
    const res = await api.get<{ connections: JiraConnection[] }>('/api/jira/connections');
    if (res.success && res.data) {
      setConnections(res.data.connections);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    const handleIpChanged = () => {
      navigate('/login?error=ip_changed', { replace: true });
    };
    window.addEventListener('session:ipChanged', handleIpChanged);
    return () => window.removeEventListener('session:ipChanged', handleIpChanged);
  }, [navigate]);

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate('/login');
  };

  const handleRevokeAll = async () => {
    await authClient.revokeSessions();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Muxlyn Hub</h1>
          <div className="flex items-center gap-2">
            {connections.length > 0 && (
              <AccountSwitcher connections={connections} onUpdate={fetchConnections} />
            )}
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
            <Button variant="destructive" onClick={handleRevokeAll}>
              Logout from all devices
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Signed in with Google</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span> {session.user.name}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span> {session.user.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jira Connections</CardTitle>
            <CardDescription>
              {connections.length === 0
                ? 'No Jira accounts connected yet.'
                : `${connections.length} account${connections.length > 1 ? 's' : ''} connected`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.length > 0 && (
              <ConnectionList connections={connections} onUpdate={fetchConnections} />
            )}
            <ConnectForm onConnected={fetchConnections} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
