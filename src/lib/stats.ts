import type { WorkoutEntry } from "./types";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function totalReps(entries: WorkoutEntry[]): number {
  return entries.reduce((sum, e) => sum + e.reps, 0);
}

export function todayEntries(entries: WorkoutEntry[], now = new Date()): WorkoutEntry[] {
  return entries.filter((e) => isSameDay(new Date(e.createdAt), now));
}

export function weekEntries(entries: WorkoutEntry[], now = new Date()): WorkoutEntry[] {
  const start = startOfDay(now);
  start.setDate(start.getDate() - 6);
  return entries.filter((e) => new Date(e.createdAt) >= start);
}

export type ExerciseStat = {
  exercise: string;
  totalReps: number;
  sets: number;
  bestSet: number;
};

export function byExercise(entries: WorkoutEntry[]): ExerciseStat[] {
  const map = new Map<string, ExerciseStat>();
  for (const e of entries) {
    const current = map.get(e.exercise) ?? {
      exercise: e.exercise,
      totalReps: 0,
      sets: 0,
      bestSet: 0,
    };
    current.totalReps += e.reps;
    current.sets += 1;
    current.bestSet = Math.max(current.bestSet, e.reps);
    map.set(e.exercise, current);
  }
  return Array.from(map.values()).sort((a, b) => b.totalReps - a.totalReps);
}

export type DayBar = {
  key: string;
  label: string;
  reps: number;
  date: Date;
};

export function last7Days(entries: WorkoutEntry[], now = new Date()): DayBar[] {
  const days: DayBar[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = startOfDay(now);
    date.setDate(date.getDate() - i);
    const dayEntries = entries.filter((e) => isSameDay(new Date(e.createdAt), date));
    days.push({
      key: date.toISOString(),
      label: date.toLocaleDateString("ru-RU", { weekday: "short" }),
      reps: totalReps(dayEntries),
      date,
    });
  }
  return days;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function pluralReps(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "повтор";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "повтора";
  return "повторов";
}

export function pluralSets(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "подход";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "подхода";
  return "подходов";
}
