export type BarFormFactor = {
  id: string;
  name: string;
  weightKg: number;
  /** Краткое описание формфактора */
  form: string;
};

export const BAR_PRESETS: BarFormFactor[] = [
  {
    id: "olympic-men",
    name: "Олимпийский",
    weightKg: 20,
    form: "Ø 50 мм · ~220 см · прямой",
  },
  {
    id: "olympic-women",
    name: "Олимпийский женский",
    weightKg: 15,
    form: "Ø 50 мм · ~201 см · прямой",
  },
  {
    id: "training",
    name: "Тренировочный",
    weightKg: 10,
    form: "Ø 25–30 мм · прямой",
  },
  {
    id: "ez",
    name: "EZ-гриф",
    weightKg: 8,
    form: "изогнутый · бицепс/трицепс",
  },
  {
    id: "trap",
    name: "Трэп-гриф",
    weightKg: 25,
    form: "шестиугольник · становая",
  },
  {
    id: "dumbbell",
    name: "Гантельный",
    weightKg: 2.5,
    form: "короткий · под блины",
  },
  {
    id: "custom",
    name: "Свой гриф",
    weightKg: 0,
    form: "укажите вес вручную",
  },
];

export const PLATE_PRESETS_KG = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5] as const;

export type PlateLine = {
  id: string;
  weightKg: number;
  /** Количество блинов на одну сторону */
  countPerSide: number;
};

export function createPlateLine(weightKg: number, countPerSide = 0): PlateLine {
  return {
    id: `${weightKg}-${Math.random().toString(36).slice(2, 7)}`,
    weightKg,
    countPerSide,
  };
}

export function sidePlatesKg(plates: PlateLine[]): number {
  return plates.reduce(
    (sum, p) => sum + (p.weightKg > 0 ? p.weightKg * Math.max(0, p.countPerSide) : 0),
    0
  );
}

export function totalPlatesCount(plates: PlateLine[]): number {
  return plates.reduce((sum, p) => sum + Math.max(0, p.countPerSide) * 2, 0);
}

export function totalBarbellKg(barWeightKg: number, plates: PlateLine[]): number {
  const bar = Number.isFinite(barWeightKg) && barWeightKg > 0 ? barWeightKg : 0;
  return Math.round((bar + sidePlatesKg(plates) * 2) * 10) / 10;
}

export function formatBarbellKg(kg: number): string {
  if (!Number.isFinite(kg)) return "0";
  const rounded = Math.round(kg * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
