import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

export interface RecipePageState {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export const useRecipePageState = create(
  persist<RecipePageState>(
    (set) => ({
      quantity: 1,
      setQuantity: (quantity) => set({ quantity }),
    }),
    {
      version: 1,
      name: "woj:recipe-page",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
