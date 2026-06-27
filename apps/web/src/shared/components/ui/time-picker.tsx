import { cn } from '@/shared/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hStr, mStr] = value.split(':');
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleHourChange = (newH: string) => {
    onChange(`${newH}:${mStr || '00'}`);
  };

  const handleMinuteChange = (newM: string) => {
    onChange(`${hStr || '09'}:${newM}`);
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Select value={hStr || '09'} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[72px] h-9 text-center">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm font-semibold text-muted-foreground">:</span>
      <Select value={mStr || '00'} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[72px] h-9 text-center">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
