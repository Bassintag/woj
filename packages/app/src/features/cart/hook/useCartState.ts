import { create } from "zustand";
import { CartItemDto } from "@/features/cart/domain/Cart";
import { createJSONStorage, persist } from "zustand/middleware";
import { RecipeDto } from "@woj/common/dto";
import { produce } from "immer";

export interface CartState {
  items: CartItemDto[];

  add: (recipe: RecipeDto, quantity?: number) => void;
  set: (recipe: RecipeDto, quantity?: number) => void;
  remove: (recipe: RecipeDto, quantity?: number) => void;
  reset: () => void;
}

export const useCartState = create(
  persist<CartState>(
    (set) => ({
      items: [],

      add: (recipe, quantity = 1) => {
        return set(
          produce((state: CartState) => {
            const item = state.items.find(
              (item) => item.recipe.id === recipe.id,
            );
            if (item) {
              item.quantity += quantity;
            } else {
              state.items.push({ quantity, recipe });
            }
          }),
        );
      },
      set: (recipe, quantity = 1) => {
        return set(
          produce((state: CartState) => {
            const item = state.items.find(
              (item) => item.recipe.id === recipe.id,
            );
            if (item) {
              item.quantity = quantity;
            } else {
              state.items.push({ quantity, recipe });
            }
          }),
        );
      },
      remove: (recipe, quantity) => {
        return set(
          produce((state: CartState) => {
            const index = state.items.findIndex(
              (item) => item.recipe.id === recipe.id,
            );
            if (index < 0) return;
            const item = state.items[index];
            if (quantity == null || item.quantity - quantity <= 0) {
              state.items.splice(index, 1);
            } else {
              item.quantity -= quantity;
            }
          }),
        );
      },
      reset: () => set({ items: [] }),
    }),
    {
      name: "woj:cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
