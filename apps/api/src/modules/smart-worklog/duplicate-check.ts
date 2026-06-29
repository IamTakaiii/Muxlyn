import type { JiraConnection } from '../worklog/jira-worklog-client';

interface WorklogEntry {
  started: string;
  author: { accountId: string };
}

export async function fetchIssueWorklogs(
  connection: JiraConnection,
  issueId: string,
  authorAccountId: string,
): Promise<Set<string>> {
  const dateSet = new Set<string>();
  let startAt = 0;
  const maxResults = 100;

  while (true) {
    const url = `${connection.jiraUrl}/rest/api/3/issue/${issueId}/worklog?startAt=${startAt}&maxResults=${maxResults}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${connection.email}:${connection.apiToken}`)}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch worklogs for ${issueId}: ${response.status}`);
    }

    const data = (await response.json()) as {
      worklogs: WorklogEntry[];
      total: number;
      maxResults: number;
    };

    for (const wl of data.worklogs) {
      if (wl.author?.accountId === authorAccountId) {
        const dateStr = wl.started.slice(0, 10);
        dateSet.add(dateStr);
      }
    }

    startAt += maxResults;
    if (startAt >= data.total) break;
  }

  return dateSet;
}

export async function checkDuplicates(
  connection: JiraConnection,
  issueIds: string[],
  dates: string[],
  authorAccountId: string,
): Promise<Set<string>> {
  const duplicateKeys = new Set<string>();
  const dateSetTarget = new Set(dates);

  const results = await Promise.all(
    issueIds.map(async (issueId) => {
      try {
        const existingDates = await fetchIssueWorklogs(connection, issueId, authorAccountId);
        return { issueId, existingDates };
      } catch {
        return { issueId, existingDates: new Set<string>() };
      }
    }),
  );

  for (const { issueId, existingDates } of results) {
    for (const date of dateSetTarget) {
      if (existingDates.has(date)) {
        duplicateKeys.add(`${issueId}:${date}`);
      }
    }
  }

  return duplicateKeys;
}
