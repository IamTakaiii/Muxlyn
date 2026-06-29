import type {
  DryRunDay,
  DryRunResponse,
  DryRunSummary,
  IssueInfo,
  PlannedWorklog,
  PlannerInput,
} from './types';

const SATURDAY = 6;
const SUNDAY = 0;
const WORKDAY_START = '09:00';
const MAX_DISTRIBUTE_TASKS_PER_DAY = 3;
const MAX_DISTRIBUTE_HOURS_PER_TASK_PER_DAY = 4;

export function getWorkingDates(
  year: number,
  month: number,
  holidays: string[],
): { dates: string[]; holidays: string[] } {
  const daysInMonth = new Date(year, month, 0).getDate();
  const holidaySet = new Set(holidays);
  const workingDates: string[] = [];
  const holidayDates: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = toDateString(date);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === SATURDAY || dayOfWeek === SUNDAY) {
      continue;
    }

    if (holidaySet.has(dateStr)) {
      holidayDates.push(dateStr);
      continue;
    }

    workingDates.push(dateStr);
  }

  return { dates: workingDates, holidays: holidayDates };
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(':').map(Number);
  return { hours: h, minutes: m };
}

export function durationHours(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;
  return (endMinutes - startMinutes) / 60;
}

export function roundToQuarter(hours: number): number {
  return Math.round(hours / 0.25) * 0.25;
}

export function computePlan(input: PlannerInput, issueMap: Map<string, IssueInfo>): DryRunResponse {
  const warnings: string[] = [];

  const { dates: workingDates, holidays } = getWorkingDates(
    input.year,
    input.month,
    input.holidays,
  );

  if (workingDates.length === 0) {
    warnings.push('No working days in this month.');
  }

  const dailyHours = input.dailyHours;

  const routineHoursPerDay = input.routineTasks.reduce((sum, t) => {
    return sum + durationHours(t.startTime, t.endTime);
  }, 0);

  const remainingHoursPerDay = Math.max(0, dailyHours - routineHoursPerDay);

  if (routineHoursPerDay > dailyHours) {
    warnings.push('Routine tasks exceed daily hours.');
  }

  const days: DryRunDay[] = [];
  let totalWorklogs = 0;
  let totalHours = 0;

  const routineWorklogsByDate = new Map<string, PlannedWorklog[]>();
  const freeSlotsByDate = new Map<string, TimeSlot[]>();
  let monthlyFreeHours = 0;

  for (const dateStr of workingDates) {
    const routineWorklogs: PlannedWorklog[] = input.routineTasks.flatMap((t) => {
      const info = issueMap.get(t.issueId);
      if (!info) return [];
      return {
        issueId: t.issueId,
        issueKey: info.issueKey,
        startTime: t.startTime,
        hours: durationHours(t.startTime, t.endTime),
      };
    });

    const freeSlots = computeFreeSlots(input.dailyHours, input.routineTasks);
    routineWorklogsByDate.set(dateStr, routineWorklogs);
    freeSlotsByDate.set(dateStr, freeSlots);
    monthlyFreeHours += freeSlots.reduce(
      (sum, slot) => sum + minutesToHours(slot.end - slot.start),
      0,
    );
  }

  const distributeWorklogsByDate = computeMonthlyDistributeWorklogs(
    workingDates,
    input.distributeTasks,
    monthlyFreeHours,
    freeSlotsByDate,
    issueMap,
  );

  for (const dateStr of workingDates) {
    const routineWorklogs = routineWorklogsByDate.get(dateStr) ?? [];
    const distributeWorklogs = distributeWorklogsByDate.get(dateStr) ?? [];

    totalWorklogs += routineWorklogs.length + distributeWorklogs.length;
    totalHours += routineWorklogs.reduce((s, w) => s + w.hours, 0);
    totalHours += distributeWorklogs.reduce((s, w) => s + w.hours, 0);

    days.push({
      date: dateStr,
      isWorkingDay: true,
      isHoliday: false,
      routineWorklogs,
      distributeWorklogs,
    });
  }

  for (const dateStr of input.holidays) {
    if (!holidays.includes(dateStr) || isWeekend(dateStr)) continue;

    const holidayWorklogs: PlannedWorklog[] = [];
    if (input.holidayTaskIssueId && issueMap.has(input.holidayTaskIssueId)) {
      const info = issueMap.get(input.holidayTaskIssueId);
      if (info) {
        holidayWorklogs.push({
          issueId: info.issueId,
          issueKey: info.issueKey,
          startTime: WORKDAY_START,
          hours: dailyHours,
        });
      }
    }

    totalWorklogs += holidayWorklogs.length;
    totalHours += holidayWorklogs.reduce((s, w) => s + w.hours, 0);

    days.push({
      date: dateStr,
      isWorkingDay: false,
      isHoliday: true,
      routineWorklogs: [],
      distributeWorklogs: holidayWorklogs,
    });
  }

  const summary: DryRunSummary = {
    totalWorkingDays: workingDates.length,
    totalHolidays: input.holidays.length,
    totalWorklogs,
    totalHours: Math.round(totalHours * 100) / 100,
    routineHoursPerDay,
    remainingHoursPerDay,
  };

  return { summary, days, warnings };
}

export function findLatestEnd(tasks: { startTime: string; endTime: string }[]): string {
  if (tasks.length === 0) return '09:00';
  let latest = '00:00';
  for (const t of tasks) {
    if (t.endTime > latest) latest = t.endTime;
  }
  return latest;
}

interface TimeSlot {
  start: number;
  end: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

function hoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}

function computeFreeSlots(
  dailyHours: number,
  routines: { startTime: string; endTime: string }[],
): TimeSlot[] {
  const workStart = timeToMinutes(WORKDAY_START);
  const workEnd = workStart + hoursToMinutes(dailyHours);
  const busy = routines
    .map((r) => ({
      start: Math.max(workStart, timeToMinutes(r.startTime)),
      end: Math.min(workEnd, timeToMinutes(r.endTime)),
    }))
    .filter((slot) => slot.end > slot.start)
    .sort((a, b) => a.start - b.start);

  const slots: TimeSlot[] = [];
  let cursor = workStart;

  for (const slot of busy) {
    if (slot.start > cursor) {
      slots.push({ start: cursor, end: slot.start });
    }
    cursor = Math.max(cursor, slot.end);
  }

  if (cursor < workEnd) {
    slots.push({ start: cursor, end: workEnd });
  }

  return slots;
}

function computeMonthlyDistributeWorklogs(
  workingDates: string[],
  tasks: { issueId: string; percentage: number }[],
  monthlyFreeHours: number,
  freeSlotsByDate: Map<string, TimeSlot[]>,
  issueMap: Map<string, IssueInfo>,
): Map<string, PlannedWorklog[]> {
  const byDate = new Map<string, PlannedWorklog[]>();
  if (tasks.length === 0 || monthlyFreeHours === 0) return byDate;

  const targets = new Map<string, number>();
  const assigned = new Map<string, number>();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const isLast = i === tasks.length - 1;
    const previousTargets = [...targets.values()].reduce((sum, h) => sum + h, 0);
    const target = isLast
      ? Math.max(0, Math.round((monthlyFreeHours - previousTargets) * 100) / 100)
      : roundToQuarter(monthlyFreeHours * (task.percentage / 100));
    targets.set(task.issueId, target);
    assigned.set(task.issueId, 0);
  }

  for (let dayIndex = 0; dayIndex < workingDates.length; dayIndex++) {
    const dateStr = workingDates[dayIndex];
    const slots = (freeSlotsByDate.get(dateStr) ?? []).map((slot) => ({ ...slot }));
    const worklogs: PlannedWorklog[] = [];
    const selectedIssueIds = new Set<string>();
    let taskCountForDay = 0;

    while (taskCountForDay < MAX_DISTRIBUTE_TASKS_PER_DAY) {
      const task = pickNextDistributeTask(
        tasks,
        targets,
        assigned,
        selectedIssueIds,
        dayIndex,
        taskCountForDay,
      );
      if (!task) break;

      const availableSlot = slots.find((slot) => slot.end - slot.start >= 15);
      if (!availableSlot) break;

      const deficit = (targets.get(task.issueId) ?? 0) - (assigned.get(task.issueId) ?? 0);
      if (deficit <= 0) break;

      const slotHours = minutesToHours(availableSlot.end - availableSlot.start);
      const remainingSlotHours = slots.reduce(
        (sum, slot) => sum + minutesToHours(Math.max(0, slot.end - slot.start)),
        0,
      );
      const otherAvailableHours = tasks
        .filter((other) => other.issueId !== task.issueId && !selectedIssueIds.has(other.issueId))
        .reduce((sum, other) => {
          const otherDeficit =
            (targets.get(other.issueId) ?? 0) - (assigned.get(other.issueId) ?? 0);
          return sum + Math.min(Math.max(0, otherDeficit), MAX_DISTRIBUTE_HOURS_PER_TASK_PER_DAY);
        }, 0);
      const taskDailyLimit = Math.max(
        MAX_DISTRIBUTE_HOURS_PER_TASK_PER_DAY,
        remainingSlotHours - otherAvailableHours,
      );
      const chunkHours = Math.min(roundToQuarter(deficit), slotHours, taskDailyLimit);
      if (chunkHours <= 0) break;

      const info = issueMap.get(task.issueId);
      if (!info) {
        selectedIssueIds.add(task.issueId);
        continue;
      }
      worklogs.push({
        issueId: task.issueId,
        issueKey: info.issueKey,
        startTime: minutesToTime(availableSlot.start),
        hours: chunkHours,
      });

      assigned.set(
        task.issueId,
        Math.round(((assigned.get(task.issueId) ?? 0) + chunkHours) * 100) / 100,
      );
      availableSlot.start += hoursToMinutes(chunkHours);
      selectedIssueIds.add(task.issueId);
      taskCountForDay++;
    }

    if (worklogs.length > 0) {
      byDate.set(dateStr, worklogs);
    }
  }

  return byDate;
}

function pickNextDistributeTask(
  tasks: { issueId: string; percentage: number }[],
  targets: Map<string, number>,
  assigned: Map<string, number>,
  selectedIssueIds: Set<string>,
  dayIndex: number,
  pickIndex: number,
): { issueId: string; percentage: number } | null {
  return (
    [...tasks]
      .filter((task) => !selectedIssueIds.has(task.issueId))
      .sort((a, b) => {
        const deficitA = (targets.get(a.issueId) ?? 0) - (assigned.get(a.issueId) ?? 0);
        const deficitB = (targets.get(b.issueId) ?? 0) - (assigned.get(b.issueId) ?? 0);
        const scoreA = deficitA / Math.max(targets.get(a.issueId) ?? 1, 1);
        const scoreB = deficitB / Math.max(targets.get(b.issueId) ?? 1, 1);
        if (scoreB !== scoreA) return scoreB - scoreA;
        const offsetA = (tasks.indexOf(a) + dayIndex + pickIndex) % tasks.length;
        const offsetB = (tasks.indexOf(b) + dayIndex + pickIndex) % tasks.length;
        return offsetA - offsetB;
      })
      .find((task) => (targets.get(task.issueId) ?? 0) - (assigned.get(task.issueId) ?? 0) > 0) ??
    null
  );
}

function isWeekend(dateStr: string): boolean {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay();
  return day === SATURDAY || day === SUNDAY;
}
