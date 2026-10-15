import { STORAGE_KEY, type WorkoutEntry } from "./types";

function normalizeEntry(raw: unknown): WorkoutEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  if (
    typeof e.id !== "string" ||
    typeof e.exercise !== "string" ||
    typeof e.reps !== "number" ||
    typeof e.createdAt !== "string"
  ) {
    return null;
  }

  const entry: WorkoutEntry = {
    id: e.id,
    exercise: e.exercise,
    reps: e.reps,
    createdAt: e.createdAt,
  };

  if (typeof e.weightKg === "number" && Number.isFinite(e.weightKg) && e.weightKg > 0) {
    entry.weightKg = e.weightKg;
  }

  return entry;
}

export function loadEntries(): WorkoutEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry).filter((e): e is WorkoutEntry => e !== null);
  } catch {
    return [];
  }
}

export function saveEntries(entries: WorkoutEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
