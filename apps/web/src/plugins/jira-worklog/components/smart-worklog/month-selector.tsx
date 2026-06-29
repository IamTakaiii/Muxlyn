import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { usePlannerStore } from '../../state/planner-store';

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export function MonthSelector() {
  const year = usePlannerStore((s) => s.year);
  const month = usePlannerStore((s) => s.month);
  const setYear = usePlannerStore((s) => s.setYear);
  const setMonth = usePlannerStore((s) => s.setMonth);

  return (
    <div className="flex items-center gap-2">
      <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        min={2020}
        max={2100}
        className="w-[80px] h-9"
      />
    </div>
  );
}
