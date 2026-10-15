"use client";

import { useState } from "react";
import { BarbellCalculator } from "@/components/barbell-calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBarbellKg } from "@/lib/barbell";
import type { AddEntryInput } from "@/hooks/use-workouts";

const CUSTOM = "__custom__";

type WorkoutFormProps = {
  exercises: string[];
  onAdd: (input: AddEntryInput) => void;
};

export function WorkoutForm({ exercises, onAdd }: WorkoutFormProps) {
  const [selected, setSelected] = useState(exercises[0] ?? CUSTOM);
  const [customName, setCustomName] = useState("");
  const [reps, setReps] = useState("12");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const exercise =
      selected === CUSTOM ? customName.trim() : selected.trim();
    const repsNum = Number(reps);
    const weightRaw = weight.trim().replace(",", ".");
    const weightNum = weightRaw === "" ? undefined : Number(weightRaw);

    if (!exercise) {
      setError("Укажите упражнение");
      return;
    }
    if (!Number.isFinite(repsNum) || repsNum <= 0) {
      setError("Введите число повторений больше нуля");
      return;
    }
    if (
      weightNum !== undefined &&
      (!Number.isFinite(weightNum) || weightNum < 0)
    ) {
      setError("Вес должен быть числом (кг)");
      return;
    }

    onAdd({
      exercise,
      reps: repsNum,
      weightKg: weightNum && weightNum > 0 ? weightNum : undefined,
    });
    setError(null);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
    if (selected === CUSTOM) {
      setCustomName("");
      setSelected(exercise);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="exercise">Упражнение</Label>
        <Select
          value={selected}
          onValueChange={(value) => {
            if (value) setSelected(value);
          }}
        >
          <SelectTrigger id="exercise" className="w-full bg-white/70">
            <SelectValue placeholder="Выберите упражнение">
              {(value: string | null) =>
                value === CUSTOM ? "Другое…" : (value ?? "Выберите упражнение")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {exercises.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
            <SelectItem value={CUSTOM}>Другое…</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected === CUSTOM && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <Label htmlFor="custom-exercise">Название</Label>
          <Input
            id="custom-exercise"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Например: Берпи"
            className="bg-white/70"
            autoFocus
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="reps">Повторения</Label>
          <Input
            id="reps"
            type="number"
            min={1}
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="bg-white/70 text-lg font-semibold tabular-nums"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Вес, кг</Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="необязательно"
            className="bg-white/70 text-lg font-semibold tabular-nums"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {[8, 10, 12, 15].map((n) => (
          <Button
            key={n}
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-10 tabular-nums"
            onClick={() => setReps(String(n))}
          >
            {n}
          </Button>
        ))}
        <span className="mx-1 self-center text-muted-foreground/40">|</span>
        {[20, 40, 60, 80].map((n) => (
          <Button
            key={`w-${n}`}
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-10 tabular-nums"
            onClick={() => setWeight(String(n))}
          >
            {n} кг
          </Button>
        ))}
      </div>

      <BarbellCalculator
        onApply={(totalKg) => {
          setWeight(formatBarbellKg(totalKg));
          setError(null);
        }}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full text-base font-semibold transition-transform active:scale-[0.98]"
      >
        {justSaved ? "Записано!" : "Записать подход"}
      </Button>
    </form>
  );
}
