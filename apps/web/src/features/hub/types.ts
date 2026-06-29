export interface JiraConnection {
  id: string;
  jira_url: string;
  jira_account_id: string;
  display_name: string;
  email: string;
  avatar_url: string;
  is_active: boolean;
  status: 'connected' | 'token_expired' | 'token_revoked';
  last_validated_at: string | null;
}
