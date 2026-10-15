"use client";

import { Button } from "@/components/ui/button";
import { formatDateTime, pluralReps } from "@/lib/stats";
import type { WorkoutEntry } from "@/lib/types";

type HistoryListProps = {
  entries: WorkoutEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function HistoryList({ entries, onRemove, onClear }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/15 bg-white/40 px-5 py-10 text-center">
        <p className="font-heading text-lg font-semibold tracking-tight">
          История пуста
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Каждый записанный подход появится здесь с датой и временем.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {entries.length} записей
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            if (confirm("Удалить всю историю тренировок?")) onClear();
          }}
        >
          Очистить
        </Button>
      </div>

      <ul className="space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="group flex items-center justify-between gap-3 rounded-xl bg-white/55 px-3 py-3 transition-colors hover:bg-white/80"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{entry.exercise}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(entry.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[var(--brand-soft)] px-2.5 py-1 font-heading text-sm font-semibold tabular-nums text-[var(--brand-ink)]">
                {entry.reps} {pluralReps(entry.reps)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="opacity-70 transition-opacity group-hover:opacity-100"
                onClick={() => onRemove(entry.id)}
                aria-label="Удалить запись"
              >
                ✕
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
