import { Button } from '@/components/ui/button';

interface Props {
  draftData: Record<string, unknown>;
  onRestore: () => void;
  onClear: () => void;
}

export function DraftRestore({ onRestore, onClear }: Props) {
  return (
    <div className="flex items-center justify-between rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3">
      <p className="text-sm text-yellow-800">
        You have unsaved work from your previous session. Would you like to restore it?
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" onClick={onRestore}>
          Restore
        </Button>
      </div>
    </div>
  );
}
