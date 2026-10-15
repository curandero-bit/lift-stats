"use client";

import { useMemo, useState } from "react";
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
import {
  BAR_PRESETS,
  PLATE_PRESETS_KG,
  createPlateLine,
  formatBarbellKg,
  sidePlatesKg,
  totalBarbellKg,
  totalPlatesCount,
  type PlateLine,
} from "@/lib/barbell";

type BarbellCalculatorProps = {
  onApply: (totalKg: number) => void;
};

export function BarbellCalculator({ onApply }: BarbellCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [barId, setBarId] = useState(BAR_PRESETS[0].id);
  const [customBarWeight, setCustomBarWeight] = useState("20");
  const [plates, setPlates] = useState<PlateLine[]>(() =>
    PLATE_PRESETS_KG.map((w) => createPlateLine(w, 0))
  );
  const [customPlateWeight, setCustomPlateWeight] = useState("");

  const barPreset = BAR_PRESETS.find((b) => b.id === barId) ?? BAR_PRESETS[0];
  const isCustomBar = barPreset.id === "custom";

  const barWeightKg = useMemo(() => {
    if (!isCustomBar) return barPreset.weightKg;
    const n = Number(customBarWeight.replace(",", "."));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [isCustomBar, barPreset.weightKg, customBarWeight]);

  const sideKg = sidePlatesKg(plates);
  const totalKg = totalBarbellKg(barWeightKg, plates);
  const plateCount = totalPlatesCount(plates);

  function setCount(id: string, countPerSide: number) {
    setPlates((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, countPerSide: Math.max(0, Math.min(10, Math.floor(countPerSide))) }
          : p
      )
    );
  }

  function bump(id: string, delta: number) {
    setPlates((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          countPerSide: Math.max(0, Math.min(10, p.countPerSide + delta)),
        };
      })
    );
  }

  function addCustomPlate() {
    const n = Number(customPlateWeight.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return;
    setPlates((prev) => [...prev, createPlateLine(n, 1)]);
    setCustomPlateWeight("");
  }

  function resetPlates() {
    setPlates(PLATE_PRESETS_KG.map((w) => createPlateLine(w, 0)));
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-[var(--brand-soft)]/40">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/30"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <p className="font-heading text-sm font-semibold tracking-tight">
            Калькулятор грифа
          </p>
          <p className="text-xs text-muted-foreground">
            Блины + формфактор → общий вес
          </p>
        </div>
        <span className="font-heading text-lg font-bold tabular-nums text-[var(--brand-ink)]">
          {open ? "▴" : `${formatBarbellKg(totalKg)} кг`}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-foreground/8 px-4 py-4 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="space-y-2">
            <Label htmlFor="bar-type">Формфактор грифа</Label>
            <Select
              value={barId}
              onValueChange={(value) => {
                if (value) setBarId(value);
              }}
            >
              <SelectTrigger id="bar-type" className="w-full bg-white/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BAR_PRESETS.map((bar) => (
                  <SelectItem key={bar.id} value={bar.id}>
                    {bar.name}
                    {bar.id !== "custom" ? ` · ${bar.weightKg} кг` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{barPreset.form}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bar-weight">Вес грифа, кг</Label>
            <Input
              id="bar-weight"
              type="number"
              min={0}
              step="0.5"
              inputMode="decimal"
              value={isCustomBar ? customBarWeight : String(barPreset.weightKg)}
              onChange={(e) => {
                if (!isCustomBar) setBarId("custom");
                setCustomBarWeight(e.target.value);
              }}
              className="bg-white/70 tabular-nums"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <Label>Блины на одну сторону</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={resetPlates}
              >
                Сбросить
              </Button>
            </div>
            <ul className="space-y-2">
              {plates.map((plate) => (
                <li
                  key={plate.id}
                  className="flex items-center gap-2 rounded-xl bg-white/55 px-2.5 py-2"
                >
                  <span className="w-16 shrink-0 font-heading text-sm font-semibold tabular-nums">
                    {formatBarbellKg(plate.weightKg)} кг
                  </span>
                  <div className="flex flex-1 items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="size-8 p-0"
                      onClick={() => bump(plate.id, -1)}
                      aria-label={`Убрать блин ${plate.weightKg} кг`}
                    >
                      −
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      inputMode="numeric"
                      value={plate.countPerSide}
                      onChange={(e) =>
                        setCount(plate.id, Number(e.target.value) || 0)
                      }
                      className="h-8 w-14 bg-white/80 text-center tabular-nums"
                      aria-label={`Количество блинов ${plate.weightKg} кг на сторону`}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="size-8 p-0"
                      onClick={() => bump(plate.id, 1)}
                      aria-label={`Добавить блин ${plate.weightKg} кг`}
                    >
                      +
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <Input
                type="number"
                min={0}
                step="0.25"
                inputMode="decimal"
                value={customPlateWeight}
                onChange={(e) => setCustomPlateWeight(e.target.value)}
                placeholder="Свой блин, кг"
                className="bg-white/70 tabular-nums"
              />
              <Button type="button" variant="secondary" onClick={addCustomPlate}>
                Добавить
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white/70 px-4 py-3">
            <BarbellSketch
              barWeightKg={barWeightKg}
              plates={plates.filter((p) => p.countPerSide > 0)}
            />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-muted-foreground">Гриф</p>
                <p className="font-heading font-semibold tabular-nums">
                  {formatBarbellKg(barWeightKg)} кг
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Блины</p>
                <p className="font-heading font-semibold tabular-nums">
                  {formatBarbellKg(sideKg * 2)} кг
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {plateCount} шт · по {formatBarbellKg(sideKg)} кг/стор.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Итого</p>
                <p className="font-heading text-lg font-bold tabular-nums text-[var(--brand-ink)]">
                  {formatBarbellKg(totalKg)} кг
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={() => onApply(totalKg)}
            disabled={totalKg <= 0}
          >
            Подставить {formatBarbellKg(totalKg)} кг в подход
          </Button>
        </div>
      )}
    </div>
  );
}

function BarbellSketch({
  barWeightKg,
  plates,
}: {
  barWeightKg: number;
  plates: PlateLine[];
}) {
  const side = [...plates]
    .filter((p) => p.countPerSide > 0)
    .flatMap((p) => Array.from({ length: p.countPerSide }, () => p.weightKg));

  return (
    <div className="flex items-center justify-center gap-0.5 py-2" aria-hidden>
      <PlateStack weights={[...side].reverse()} mirror />
      <div
        className="h-2.5 flex-1 rounded-full bg-[var(--brand-ink)]/80"
        title={`Гриф ${formatBarbellKg(barWeightKg)} кг`}
      />
      <PlateStack weights={side} />
    </div>
  );
}

function PlateStack({
  weights,
  mirror = false,
}: {
  weights: number[];
  mirror?: boolean;
}) {
  const list = mirror ? [...weights].reverse() : weights;
  return (
    <div className={`flex items-center gap-0.5 ${mirror ? "flex-row-reverse" : ""}`}>
      {list.length === 0 ? (
        <div className="h-4 w-1 rounded-sm bg-[var(--brand-ink)]/25" />
      ) : (
        list.map((w, i) => {
          const h = Math.min(36, 14 + w);
          return (
            <div
              key={`${w}-${i}`}
              className="w-2 rounded-sm bg-[var(--brand)]"
              style={{ height: h }}
              title={`${formatBarbellKg(w)} кг`}
            />
          );
        })
      )}
    </div>
  );
}
