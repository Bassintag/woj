import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ServingsState {
  servings: number;
  set(servings: number): void;
}

export const useServingsStore = create<ServingsState>()(
  persist(
    (set) => ({
      servings: 2,
      set(servings) {
        set({ servings: Math.max(1, servings) });
      },
    }),
    { name: "woj-servings" },
  ),
);
