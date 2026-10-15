export type WorkoutEntry = {
  id: string;
  exercise: string;
  reps: number;
  /** Вес в кг; отсутствует или 0 — без отягощения */
  weightKg?: number;
  createdAt: string;
};

export const DEFAULT_EXERCISES = [
  "Отжимания",
  "Подтягивания",
  "Приседания",
  "Выпады",
  "Скручивания",
  "Планка (сек)",
  "Жим лёжа",
  "Становая тяга",
  "Тяга штанги",
  "Подъём на бицепс",
] as const;

export const STORAGE_KEY = "povtor-workout-entries-v1";
