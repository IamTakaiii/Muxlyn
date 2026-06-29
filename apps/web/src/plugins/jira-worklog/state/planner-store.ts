import { create } from 'zustand';

export interface RoutineTask {
  id: string;
  issueId: string;
  issueKey: string;
  startTime: string;
  endTime: string;
}

export interface DistributeTask {
  id: string;
  issueId: string;
  issueKey: string;
  percentage: number;
}

interface PlannerState {
  year: number;
  month: number;
  holidays: string[];
  dailyHours: number;
  routineTasks: RoutineTask[];
  distributeTasks: DistributeTask[];
  holidayTaskIssueId: string;

  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDailyHours: (hours: number) => void;
  setHolidayTaskIssueId: (issueId: string) => void;
  addHoliday: (date: string) => void;
  removeHoliday: (date: string) => void;
  addRoutineTask: (task: RoutineTask) => void;
  updateRoutineTask: (id: string, task: Partial<RoutineTask>) => void;
  removeRoutineTask: (id: string) => void;
  addDistributeTask: (task: DistributeTask) => void;
  updateDistributeTask: (id: string, task: Partial<DistributeTask>) => void;
  removeDistributeTask: (id: string) => void;
  autoDistribute: () => void;
  reset: () => void;
}

function nextId(): string {
  return crypto.randomUUID();
}

const now = new Date();

function getInitialState() {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    holidays: [] as string[],
    dailyHours: 8,
    routineTasks: [] as RoutineTask[],
    distributeTasks: [] as DistributeTask[],
    holidayTaskIssueId: '',
  };
}

export const usePlannerStore = create<PlannerState>((set) => ({
  ...getInitialState(),

  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),

  setDailyHours: (dailyHours) => set({ dailyHours }),

  setHolidayTaskIssueId: (holidayTaskIssueId) => set({ holidayTaskIssueId }),

  addHoliday: (date) =>
    set((s) => ({
      holidays: s.holidays.includes(date) ? s.holidays : [...s.holidays, date].sort(),
    })),

  removeHoliday: (date) => set((s) => ({ holidays: s.holidays.filter((d) => d !== date) })),

  addRoutineTask: (task) =>
    set((s) => ({
      routineTasks: [...s.routineTasks, { ...task, id: nextId() }].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      ),
    })),

  updateRoutineTask: (id, updates) =>
    set((s) => ({
      routineTasks: s.routineTasks
        .map((t) => (t.id === id ? { ...t, ...updates } : t))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    })),

  removeRoutineTask: (id) =>
    set((s) => ({ routineTasks: s.routineTasks.filter((t) => t.id !== id) })),

  addDistributeTask: (task) =>
    set((s) => {
      const tasks = [...s.distributeTasks, { ...task, id: nextId() }];
      const count = tasks.length;
      const equalPct = Math.floor(100 / count);
      const remainder = 100 - equalPct * (count - 1);

      const updated = tasks.map((t, i) => ({
        ...t,
        percentage: i === count - 1 ? remainder : equalPct,
      }));

      return { distributeTasks: updated };
    }),

  updateDistributeTask: (id, updates) =>
    set((s) => ({
      distributeTasks: s.distributeTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeDistributeTask: (id) =>
    set((s) => {
      const remaining = s.distributeTasks.filter((t) => t.id !== id);
      if (remaining.length === 0) return { distributeTasks: [] };

      const count = remaining.length;
      const equalPct = Math.floor(100 / count);
      const remainder = 100 - equalPct * (count - 1);

      const updated = remaining.map((t, i) => ({
        ...t,
        percentage: i === count - 1 ? remainder : equalPct,
      }));

      return { distributeTasks: updated };
    }),

  autoDistribute: () =>
    set((s) => {
      const count = s.distributeTasks.length;
      if (count === 0) return {};

      const equalPct = Math.floor(100 / count);
      const remainder = 100 - equalPct * (count - 1);

      return {
        distributeTasks: s.distributeTasks.map((t, i) => ({
          ...t,
          percentage: i === count - 1 ? remainder : equalPct,
        })),
      };
    }),

  reset: () => set(getInitialState()),
}));
