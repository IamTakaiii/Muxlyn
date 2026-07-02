import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Input } from './input';

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hStr, mStr] = value.split(':');
  const [hourInput, setHourInput] = useState(hStr || '09');
  const [minuteInput, setMinuteInput] = useState(mStr || '00');

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const [h, m] = value.split(':');
    setHourInput(h || '09');
    setMinuteInput(m || '00');
  }, [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // only digits
    if (val.length > 2) val = val.slice(-2);

    setHourInput(val);

    const num = parseInt(val, 10);
    if (!Number.isNaN(num) && num >= 0 && num <= 23) {
      const formatted = String(num).padStart(2, '0');
      if (val.length === 2 || num >= 3) {
        onChange(`${formatted}:${minuteInput}`);
        setTimeout(() => {
          minuteRef.current?.focus();
          minuteRef.current?.select();
        }, 0);
      }
    }
  };

  const handleHourBlur = () => {
    let num = parseInt(hourInput, 10);
    if (Number.isNaN(num) || num < 0 || num > 23) {
      num = 9; // default
    }
    const formatted = String(num).padStart(2, '0');
    setHourInput(formatted);
    onChange(`${formatted}:${minuteInput}`);
  };

  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let num = parseInt(hourInput, 10);
      if (Number.isNaN(num)) num = 9;
      num = (num + 1) % 24;
      const formatted = String(num).padStart(2, '0');
      setHourInput(formatted);
      onChange(`${formatted}:${minuteInput}`);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let num = parseInt(hourInput, 10);
      if (Number.isNaN(num)) num = 9;
      num = (num - 1 + 24) % 24;
      const formatted = String(num).padStart(2, '0');
      setHourInput(formatted);
      onChange(`${formatted}:${minuteInput}`);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      minuteRef.current?.focus();
      minuteRef.current?.select();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    setMinuteInput(val);

    const num = parseInt(val, 10);
    if (!Number.isNaN(num) && num >= 0 && num <= 59) {
      if (val.length === 2) {
        const formatted = String(num).padStart(2, '0');
        onChange(`${hourInput}:${formatted}`);
      }
    }
  };

  const handleMinuteBlur = () => {
    let num = parseInt(minuteInput, 10);
    if (Number.isNaN(num) || num < 0 || num > 59) {
      num = 0; // default
    }
    const formatted = String(num).padStart(2, '0');
    setMinuteInput(formatted);
    onChange(`${hourInput}:${formatted}`);
  };

  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let num = parseInt(minuteInput, 10);
      if (Number.isNaN(num)) num = 0;
      num = (num + 1) % 60;
      const formatted = String(num).padStart(2, '0');
      setMinuteInput(formatted);
      onChange(`${hourInput}:${formatted}`);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let num = parseInt(minuteInput, 10);
      if (Number.isNaN(num)) num = 0;
      num = (num - 1 + 60) % 60;
      const formatted = String(num).padStart(2, '0');
      setMinuteInput(formatted);
      onChange(`${hourInput}:${formatted}`);
    } else if (e.key === 'Backspace' && !minuteInput) {
      e.preventDefault();
      hourRef.current?.focus();
      hourRef.current?.select();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      minuteRef.current?.blur();
    }
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Input
        ref={hourRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={hourInput}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
        onKeyDown={handleHourKeyDown}
        onFocus={(e) => {
          e.target.select();
        }}
        className="w-[72px] h-9 text-center font-mono"
        placeholder="HH"
      />

      <span className="text-sm font-semibold text-muted-foreground">:</span>

      <Input
        ref={minuteRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={minuteInput}
        onChange={handleMinuteChange}
        onBlur={handleMinuteBlur}
        onKeyDown={handleMinuteKeyDown}
        onFocus={(e) => {
          e.target.select();
        }}
        className="w-[72px] h-9 text-center font-mono"
        placeholder="MM"
      />
    </div>
  );
}
