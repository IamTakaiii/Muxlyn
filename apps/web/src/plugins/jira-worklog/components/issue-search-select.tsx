import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useIssueSearch } from '../api/search';

interface IssueSearchSelectProps {
  value: { id: string; key: string; summary: string } | null;
  onChange: (value: { id: string; key: string; summary: string } | null) => void;
  placeholder?: string;
  className?: string;
}

function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('done') || s.includes('resolved') || s.includes('closed') || s.includes('complete')) {
    return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
  }
  if (s.includes('progress') || s.includes('review') || s.includes('active') || s.includes('test')) {
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
  }
  return 'bg-muted/50 text-muted-foreground border-muted-foreground/20';
}

export function IssueSearchSelect({ value, onChange, placeholder, className }: IssueSearchSelectProps) {
  const [searchQ, setSearchQ] = useState(value ? `${value.key} • ${value.summary}` : '');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchQ = useDebounce(searchQ, 300);

  const isSelectedText = value && searchQ === `${value.key} • ${value.summary}`;
  const searchQuery = isSelectedText ? '' : searchQ;

  const { data: issueResult, isLoading } = useIssueSearch(
    isFocused || searchQuery.length > 0 ? { freeText: searchQuery, pageSize: 15 } : null
  );

  useEffect(() => {
    if (value) {
      setSearchQ(`${value.key} • ${value.summary}`);
    } else {
      setSearchQ('');
    }
  }, [value]);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Input
          type="text"
          value={searchQ}
          onChange={(e) => {
            setSearchQ(e.target.value);
            if (value) {
              onChange(null);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder || 'Search task...'}
          className={className}
        />
        <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {isFocused && !value && issueResult?.items && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover shadow-md divide-y">
          {issueResult.items.length === 0 && (
            <div className="px-3 py-2.5 text-xs text-muted-foreground text-center">
              No tasks found
            </div>
          )}
          {issueResult.items
            .filter((issue) => !issue.isSubtask && issue.issueType.toLowerCase() !== 'epic')
            .map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => {
                  onChange({ id: issue.id, key: issue.key, summary: issue.summary });
                  setSearchQ(`${issue.key} • ${issue.summary}`);
                }}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center justify-between gap-2"
              >
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-semibold text-foreground">{issue.key}</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-xs">{issue.summary}</span>
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 shrink-0 font-normal border ${getStatusBadgeClass(issue.status)}`}
                >
                  {issue.status}
                </Badge>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
