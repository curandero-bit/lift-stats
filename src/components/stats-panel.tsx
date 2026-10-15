"use client";

import {
  byExercise,
  formatVolume,
  formatWeight,
  last7Days,
  pluralReps,
  pluralSets,
  todayEntries,
  totalReps,
  totalVolume,
  weekEntries,
} from "@/lib/stats";
import type { WorkoutEntry } from "@/lib/types";

type StatsPanelProps = {
  entries: WorkoutEntry[];
};

export function StatsPanel({ entries }: StatsPanelProps) {
  const today = totalReps(todayEntries(entries));
  const week = totalReps(weekEntries(entries));
  const all = totalReps(entries);
  const volume = totalVolume(entries);
  const exerciseStats = byExercise(entries);
  const days = last7Days(entries);
  const maxDay = Math.max(...days.map((d) => d.reps), 1);
  const best = exerciseStats[0];
  const heaviest = [...exerciseStats].sort(
    (a, b) => b.bestWeightKg - a.bestWeightKg
  )[0];

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/15 bg-white/40 px-5 py-10 text-center">
        <p className="font-heading text-lg font-semibold tracking-tight">
          Пока нет статистики
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Запишите первый подход — здесь появятся итоги дня, недели и по
          упражнениям.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Сегодня" value={today} unit={pluralReps(today)} />
        <StatTile label="Неделя" value={week} unit={pluralReps(week)} />
        <StatTile label="Всего" value={all} unit={pluralReps(all)} />
        <StatTile
          label="Тоннаж"
          valueLabel={formatVolume(volume)}
          unit="вес × повторы"
        />
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          7 дней
        </h3>
        <div className="flex h-36 items-end gap-2">
          {days.map((day) => {
            const height = Math.max((day.reps / maxDay) * 100, day.reps > 0 ? 8 : 0);
            return (
              <div
                key={day.key}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                  {day.reps || ""}
                </span>
                <div className="flex h-24 w-full items-end">
                  <div
                    className="week-bar w-full rounded-t-md bg-[var(--brand)]/85 transition-[height] duration-500 ease-out"
                    style={{ height: `${height}%` }}
                    title={`${day.reps} ${pluralReps(day.reps)}`}
                  />
                </div>
                <span className="text-[11px] capitalize text-muted-foreground">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {best && (
        <div className="rounded-2xl bg-[var(--brand-soft)] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--brand-ink)]/70">
            Лучший объём
          </p>
          <p className="mt-1 font-heading text-lg font-semibold tracking-tight text-[var(--brand-ink)]">
            {best.exercise}
          </p>
          <p className="text-sm text-[var(--brand-ink)]/80">
            {best.totalReps} {pluralReps(best.totalReps)} · {best.sets}{" "}
            {pluralSets(best.sets)}
            {best.bestWeightKg > 0
              ? ` · макс. вес ${formatWeight(best.bestWeightKg)} кг`
              : ` · лучший подход ${best.bestSet}`}
          </p>
        </div>
      )}

      {heaviest && heaviest.bestWeightKg > 0 && (
        <div className="rounded-2xl bg-white/55 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Максимальный вес
          </p>
          <p className="mt-1 font-heading text-lg font-semibold tracking-tight">
            {heaviest.exercise}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatWeight(heaviest.bestWeightKg)} кг за один подход
          </p>
        </div>
      )}

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          По упражнениям
        </h3>
        <ul className="space-y-2">
          {exerciseStats.map((stat, index) => {
            const share = Math.round((stat.totalReps / all) * 100);
            return (
              <li
                key={stat.exercise}
                className="rounded-xl bg-white/55 px-3 py-3"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <span className="font-medium">{stat.exercise}</span>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {stat.totalReps} · {share}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-700 ease-out"
                    style={{ width: `${share}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {stat.sets} {pluralSets(stat.sets)} · рекорд подхода{" "}
                  {stat.bestSet}
                  {stat.bestWeightKg > 0
                    ? ` · макс. ${formatWeight(stat.bestWeightKg)} кг`
                    : ""}
                  {stat.totalVolume > 0
                    ? ` · тоннаж ${formatVolume(stat.totalVolume)}`
                    : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  valueLabel,
  unit,
}: {
  label: string;
  value?: number;
  valueLabel?: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl bg-white/60 px-3 py-4 text-center shadow-[0_1px_0_rgba(15,40,30,0.04)]">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
        {valueLabel ?? value}
      </p>
      <p className="text-[11px] text-muted-foreground">{unit}</p>
    </div>
  );
}
