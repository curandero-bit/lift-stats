"use client";

import { HistoryList } from "@/components/history-list";
import { StatsPanel } from "@/components/stats-panel";
import { WorkoutForm } from "@/components/workout-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { useWorkouts } from "@/hooks/use-workouts";
import { todayEntries, totalReps } from "@/lib/stats";

export function WorkoutApp() {
  const { entries, ready, addEntry, removeEntry, clearAll, knownExercises } =
    useWorkouts();
  // Avoid `new Date()` during prerender — only compute after client hydration.
  const todayReps = useMemo(
    () => (ready ? totalReps(todayEntries(entries)) : 0),
    [ready, entries]
  );

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-atmosphere" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--brand)]/20 blur-3xl animate-float" aria-hidden />
      <div className="pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl animate-float-delayed" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-lg flex-col px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <header className="mb-8 animate-rise">
          <p className="font-heading text-4xl font-bold tracking-tight text-[var(--brand-ink)] sm:text-5xl">
            Повтор
          </p>
          <p className="mt-2 max-w-sm text-base text-foreground/70">
            Записывайте подходы и смотрите, как растёт объём тренировок.
          </p>
          {ready && entries.length > 0 && (
            <p className="mt-4 text-sm font-medium text-[var(--brand-ink)]/80">
              Сегодня:{" "}
              <span className="font-heading text-lg font-bold tabular-nums">
                {todayReps}
              </span>{" "}
              повторений
            </p>
          )}
        </header>

        <section className="mb-6 rounded-3xl border border-white/60 bg-white/55 p-5 shadow-[0_20px_50px_-30px_rgba(20,60,40,0.45)] backdrop-blur-md animate-rise-delayed sm:p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold tracking-tight">
            Новый подход
          </h2>
          {ready ? (
            <WorkoutForm exercises={knownExercises} onAdd={addEntry} />
          ) : (
            <div className="h-40 animate-pulse rounded-xl bg-white/50" />
          )}
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/55 p-5 shadow-[0_20px_50px_-30px_rgba(20,60,40,0.35)] backdrop-blur-md animate-rise-late sm:p-6">
          <Tabs defaultValue="stats">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              {ready ? (
                <StatsPanel entries={entries} />
              ) : (
                <div className="h-48 animate-pulse rounded-xl bg-white/50" />
              )}
            </TabsContent>
            <TabsContent value="history">
              {ready ? (
                <HistoryList
                  entries={entries}
                  onRemove={removeEntry}
                  onClear={clearAll}
                />
              ) : (
                <div className="h-48 animate-pulse rounded-xl bg-white/50" />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
