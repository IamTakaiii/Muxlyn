import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
  startMonth?: Date;
  endMonth?: Date;
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + 'T00:00:00');
  return isNaN(d.getTime()) ? undefined : d;
}

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function displayDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled,
  startMonth,
  endMonth,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-9 w-full justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {selected ? displayDate(selected) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onChange?.(formatDate(date));
            }
            setOpen(false);
          }}
          disabled={disabled}
          startMonth={startMonth}
          endMonth={endMonth}
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  from?: string;
  to?: string;
  onFromChange?: (value: string) => void;
  onToChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
  startMonth?: Date;
  endMonth?: Date;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  placeholder = 'Pick a date',
  className,
  disabled,
  startMonth,
  endMonth,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-9 justify-start text-left font-normal w-full',
            !fromDate && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {fromDate ? (
            toDate ? (
              <>
                {displayDate(fromDate)} – {displayDate(toDate)}
              </>
            ) : (
              displayDate(fromDate)
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={fromDate && toDate ? { from: fromDate, to: toDate } : undefined}
          onSelect={(range) => {
            if (range?.from) {
              onFromChange?.(formatDate(range.from));
              if (range.to) {
                onToChange?.(formatDate(range.to));
                setOpen(false);
              }
            }
          }}
          disabled={disabled}
          startMonth={startMonth}
          endMonth={endMonth}
          numberOfMonths={isMobile ? 1 : 2}
        />
      </PopoverContent>
    </Popover>
  );
}
