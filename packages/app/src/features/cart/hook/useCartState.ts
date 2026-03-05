import { CartItemDto } from "@/features/cart/domain/Cart";
import { RecipeDetailsDto } from "@woj/common/dto";
import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartState {
  items: CartItemDto[];

  add: (recipe: RecipeDetailsDto, quantity?: number) => void;
  set: (recipe: RecipeDetailsDto, quantity?: number) => void;
  remove: (recipe: RecipeDetailsDto, quantity?: number) => void;
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
