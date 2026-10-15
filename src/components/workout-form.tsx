"use client";

import { useState } from "react";
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

const CUSTOM = "__custom__";

type WorkoutFormProps = {
  exercises: string[];
  onAdd: (exercise: string, reps: number) => void;
};

export function WorkoutForm({ exercises, onAdd }: WorkoutFormProps) {
  const [selected, setSelected] = useState(exercises[0] ?? CUSTOM);
  const [customName, setCustomName] = useState("");
  const [reps, setReps] = useState("12");
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const exercise =
      selected === CUSTOM ? customName.trim() : selected.trim();
    const repsNum = Number(reps);

    if (!exercise) {
      setError("Укажите упражнение");
      return;
    }
    if (!Number.isFinite(repsNum) || repsNum <= 0) {
      setError("Введите число повторений больше нуля");
      return;
    }

    onAdd(exercise, repsNum);
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
            <SelectValue placeholder="Выберите упражнение" />
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

      <div className="space-y-2">
        <Label htmlFor="reps">Повторения</Label>
        <div className="flex gap-2">
          <Input
            id="reps"
            type="number"
            min={1}
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="bg-white/70 text-lg font-semibold tabular-nums"
          />
          <div className="flex gap-1">
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
          </div>
        </div>
      </div>

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
