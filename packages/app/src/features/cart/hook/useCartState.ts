import { create } from "zustand";
import { Recipe } from "@/features/recipe/domain/Recipe";
import { CartItem } from "@/features/cart/domain/Cart";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartState {
  items: CartItem[];

  add: (recipe: Recipe, quantity?: number) => void;
  set: (recipe: Recipe, quantity?: number) => void;
  remove: (recipe: Recipe, quantity?: number) => void;
  reset: () => void;
}

export const useCartState = create(
  persist<CartState>(
    (set, get) => ({
      items: [],

      add: (recipe, quantity = 1) => {
        const { items } = get();
        const index = items.findIndex((item) => item.recipe.id === recipe.id);
        if (index >= 0) {
          const copy = [...items];
          copy[index] = {
            ...copy[index],
            quantity: copy[index].quantity + quantity,
          };
          set({ items: copy });
        } else {
          set({ items: [...items, { quantity, recipe }] });
        }
      },
      set: (recipe, quantity = 1) => {
        const { items } = get();
        const index = items.findIndex((item) => item.recipe.id === recipe.id);
        if (index >= 0) {
          const copy = [...items];
          copy[index] = { ...copy[index], quantity };
          set({ items: copy });
        } else {
          set({ items: [...items, { quantity, recipe }] });
        }
      },
      remove: (recipe, quantity) => {
        const { items } = get();
        const index = items.findIndex((item) => item.recipe.id === recipe.id);
        if (index < 0) return;
        const item = items[index];
        const copy = [...items];
        if (quantity == null || item.quantity - quantity <= 0) {
          copy.splice(index, 1);
        } else {
          copy.splice(index, 1, {
            ...item,
            quantity: item.quantity - quantity,
          });
        }
        set({ items: copy });
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
