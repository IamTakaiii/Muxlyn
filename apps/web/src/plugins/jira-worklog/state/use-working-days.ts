import { useMemo } from 'react';

function getWorkingDates(year: number, month: number, holidays: string[]): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  const holidaySet = new Set(holidays);
  let count = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (holidaySet.has(dateStr)) continue;
    count++;
  }

  return count;
}

export function useWorkingDays(year: number, month: number, holidays: string[]): number {
  return useMemo(() => getWorkingDates(year, month, holidays), [year, month, holidays]);
}
