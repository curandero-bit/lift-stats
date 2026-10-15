"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createId, loadEntries, saveEntries } from "@/lib/storage";
import type { WorkoutEntry } from "@/lib/types";
import { DEFAULT_EXERCISES } from "@/lib/types";

export function useWorkouts() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveEntries(entries);
  }, [entries, ready]);

  const addEntry = useCallback((exercise: string, reps: number) => {
    const trimmed = exercise.trim();
    if (!trimmed || reps <= 0) return;
    const entry: WorkoutEntry = {
      id: createId(),
      exercise: trimmed,
      reps: Math.floor(reps),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  const knownExercises = useMemo(() => {
    const fromHistory = entries.map((e) => e.exercise);
    return Array.from(new Set([...DEFAULT_EXERCISES, ...fromHistory]));
  }, [entries]);

  return {
    entries,
    ready,
    addEntry,
    removeEntry,
    clearAll,
    knownExercises,
  };
}
