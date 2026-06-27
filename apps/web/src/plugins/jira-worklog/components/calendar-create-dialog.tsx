import { useState, useCallback, useMemo } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { DatePicker } from '@/shared/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/modal';
import { cn } from '@/shared/lib/utils';
import {
  useIssueSearch,
  type IssueSearchItem,
} from '../api/search';
import {
  useBulkCreateWorklogs,
  type BulkCreateEntry,
  type BulkCreateResult,
} from '../api/bulk-worklog';

interface CalendarCreateDialogProps {
  date: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function datesBetween(from: string, to: string): string[] {
  const dates: string[] = [];
  let current = from;
  while (current <= to) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

function formatDisplayDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function CalendarCreateDialog({
  date,
  open,
  onOpenChange,
  onCreated,
}: CalendarCreateDialogProps) {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<IssueSearchItem[] | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueSearchItem | null>(null);
  const [dateFrom, setDateFrom] = useState(date);
  const [dateTo, setDateTo] = useState(date);
  const [startH, setStartH] = useState(9);
  const [startM, setStartM] = useState(0);
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(0);
  const [comment, setComment] = useState('');
  const [result, setResult] = useState<BulkCreateResult | null>(null);

  const searchMutation = useIssueSearch();
  const createMutation = useBulkCreateWorklogs();
  const isLoading = searchMutation.isPending || createMutation.isPending;

  const dayCount = useMemo(() => {
    const days = datesBetween(dateFrom, dateTo);
    return Math.max(1, days.length);
  }, [dateFrom, dateTo]);

  const totalHours = useMemo(() => {
    const durationSeconds = hours * 3600 + minutes * 60;
    return ((durationSeconds * dayCount) / 3600).toFixed(1);
  }, [hours, minutes, dayCount]);

  const handleSearch = useCallback(() => {
    if (!searchText.trim()) return;
    searchMutation.mutate(
      { freeText: searchText.trim() },
      {
        onSuccess: (res) => {
          if (res.data) setResults(res.data.items);
        },
      },
    );
  }, [searchText, searchMutation]);

  const handleSelectIssue = useCallback((issue: IssueSearchItem) => {
    setSelectedIssue(issue);
    setResults(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedIssue) return;
    const durationSeconds = hours * 3600 + minutes * 60;
    const dates = datesBetween(dateFrom, dateTo);
    const started = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00`;
    const entries: BulkCreateEntry[] = dates.map((d) => ({
      issueId: selectedIssue.id,
      date: d,
      durationSeconds,
      comment: comment || undefined,
      started: `${d}T${started}.000+0000`,
    }));
    createMutation.mutate(entries, {
      onSuccess: (res) => {
        if (res.data && res.success) {
          setResult(res.data);
          onCreated?.();
        }
      },
    });
  }, [selectedIssue, dateFrom, dateTo, hours, minutes, comment, createMutation, onCreated]);

  const handleClose = () => {
    onOpenChange(false);
    if (!createMutation.isPending) {
      setTimeout(() => {
        setSearchText('');
        setResults(null);
        setSelectedIssue(null);
        setDateFrom(date);
        setDateTo(date);
        setStartH(9);
        setStartM(0);
        setHours(2);
        setMinutes(0);
        setComment('');
        setResult(null);
        searchMutation.reset();
        createMutation.reset();
      }, 200);
    }
  };

  const errorText =
    createMutation.data && !createMutation.data.success
      ? createMutation.data.message
      : null;

  const displayDate = formatDisplayDate(date);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[440px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-base font-semibold">Log Work</DialogTitle>
          <DialogDescription className="text-xs pt-1">{displayDate}</DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold">
                {result.succeeded} saved{result.failed > 0 && <span className="text-destructive"> · {result.failed} failed</span>}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total: {result.totalHours}h</p>
            {result.results.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border p-3">
                {result.results.map((r, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-2 rounded px-2 py-1 text-sm',
                      r.status === 'success'
                        ? 'bg-green-50 dark:bg-green-950/20'
                        : 'bg-red-50 dark:bg-red-950/20',
                    )}
                  >
                    {r.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <span className="font-medium">{r.issueKey}</span>
                    {r.status === 'success' ? (
                      <span className="text-muted-foreground">({r.hours}h)</span>
                    ) : (
                      <span className="text-destructive text-xs">{r.error}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" onClick={handleClose} className="w-full">Close</Button>
          </div>
        ) : selectedIssue ? (
          <>
            <div className="px-6 py-5 space-y-5">
              {/* Selected issue info */}
              <div className="rounded-md border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssue(null);
                      setResults([]);
                      setSearchText('');
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ← Change issue
                  </button>
                  {selectedIssue.isSubtask && (
                    <span className="text-xs text-destructive font-medium">Cannot log sub-tasks</span>
                  )}
                </div>
                <p className="font-mono font-medium mt-1.5">{selectedIssue.key}</p>
                <p className="text-sm text-muted-foreground truncate">{selectedIssue.summary}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {selectedIssue.issueType} · {selectedIssue.status} · {selectedIssue.projectKey}
                </p>
              </div>

              {/* Date range */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Date &amp; Start
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Start Date</Label>
                    <DatePicker
                      value={dateFrom}
                      onChange={(v) => {
                        setDateFrom(v);
                        if (v > dateTo) {
                          setDateTo(v);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">End Date</Label>
                    <DatePicker
                      value={dateTo}
                      onChange={(v) => {
                        setDateTo(v);
                        if (v < dateFrom) {
                          setDateFrom(v);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Input
                    type="time"
                    value={`${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`}
                    onChange={(e) => { const [h, m] = e.target.value.split(':').map(Number); setStartH(h); setStartM(m); }}
                    className="h-9 w-[110px]"
                    step={300}
                  />
                  <span className="text-xs text-muted-foreground">start time</span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Duration per day
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      max={24}
                      value={hours || ''}
                      placeholder="0"
                      onChange={(e) => setHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                      className="h-9 text-center"
                    />
                    <span className="text-sm text-muted-foreground font-medium">h</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={minutes || ''}
                      placeholder="0"
                      onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="h-9 text-center"
                    />
                    <span className="text-sm text-muted-foreground font-medium">m</span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <Label htmlFor="create-comment" className="text-xs text-muted-foreground">Comment</Label>
                <Textarea
                  id="create-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you work on?"
                  className="h-20 resize-none text-sm"
                />
              </div>

              {errorText && (
                <p className="text-sm text-destructive bg-destructive/5 rounded-md px-3 py-2">{errorText}</p>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
              <div className="text-sm text-muted-foreground">
                {dayCount} {dayCount === 1 ? 'entry' : 'entries'} · {totalHours}h total
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>Cancel</Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isLoading || selectedIssue.isSubtask || (hours === 0 && minutes === 0)}
                >
                  {createMutation.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  Log {totalHours}h
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              {/* Date range — visible immediately */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Date &amp; Start
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Start Date</Label>
                    <DatePicker
                      value={dateFrom}
                      onChange={(v) => {
                        setDateFrom(v);
                        if (v > dateTo) {
                          setDateTo(v);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">End Date</Label>
                    <DatePicker
                      value={dateTo}
                      onChange={(v) => {
                        setDateTo(v);
                        if (v < dateFrom) {
                          setDateFrom(v);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Input
                    type="time"
                    value={`${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`}
                    onChange={(e) => { const [h, m] = e.target.value.split(':').map(Number); setStartH(h); setStartM(m); }}
                    className="h-9 w-[110px]"
                    step={300}
                  />
                  <span className="text-xs text-muted-foreground">start time</span>
                </div>
                {dayCount > 1 && (
                  <p className="text-[11px] text-muted-foreground">{dayCount} days</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Duration per day
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1.5">
                    <Input type="number" min={0} max={24} value={hours || ''} placeholder="0"
                      onChange={(e) => setHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                      className="h-9 text-center" />
                    <span className="text-sm text-muted-foreground font-medium">h</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    <Input type="number" min={0} max={59} value={minutes || ''} placeholder="0"
                      onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="h-9 text-center" />
                    <span className="text-sm text-muted-foreground font-medium">m</span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <Label htmlFor="create-comment" className="text-xs text-muted-foreground">Comment</Label>
                <Textarea id="create-comment" value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you work on?" className="h-20 resize-none text-sm" />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground font-medium">assign to issue</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issue by key or summary..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading || !searchText.trim()} className="w-full">
                {searchMutation.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Search
              </Button>

              {results && results.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-2">No issues found.</p>
              )}

              {results && results.length > 0 && (
                <div className="max-h-52 overflow-y-auto rounded-md border divide-y">
                  {results.map((issue) => (
                    <button key={issue.id} type="button"
                      onClick={() => handleSelectIssue(issue)}
                      disabled={issue.isSubtask}
                      className={cn('w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors', issue.isSubtask && 'opacity-50')}>
                      <span className="font-mono font-medium text-sm">{issue.key}</span>
                      <span className="ml-2 text-sm text-muted-foreground truncate block">{issue.summary}</span>
                      <span className="text-xs text-muted-foreground/60">{issue.issueType} · {issue.projectKey}{issue.isSubtask && ' · SUB-TASK'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
              <div className="text-sm text-muted-foreground">{dayCount} {dayCount === 1 ? 'day' : 'days'}</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
