import { useState } from 'react';
import { api } from '@/api/client';
import type { JiraConnection } from './types';

interface Props {
  connections: JiraConnection[];
  onUpdate: () => void;
}

export function AccountSwitcher({ connections, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const active = connections.find((c) => c.is_active);

  const handleSwitch = async (id: string) => {
    await api.post(`/api/jira/connections/${id}/switch`);
    setOpen(false);
    onUpdate();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
      >
        {active?.avatar_url && (
          <img src={active.avatar_url} alt="" className="h-5 w-5 rounded-full" />
        )}
        <span>{active ? active.display_name : 'No Jira account'}</span>
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>Toggle dropdown</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-64 rounded-md border bg-popover shadow-md">
          <div className="p-1">
            {connections.map((conn) => (
              <button
                key={conn.id}
                type="button"
                onClick={() => handleSwitch(conn.id)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent"
              >
                {conn.avatar_url && (
                  <img src={conn.avatar_url} alt="" className="h-5 w-5 rounded-full" />
                )}
                <div className="text-left">
                  <p className="font-medium">{conn.display_name}</p>
                  <p className="text-xs text-muted-foreground">{conn.jira_url}</p>
                </div>
                {conn.is_active && <span className="ml-auto text-xs text-primary">Active</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
