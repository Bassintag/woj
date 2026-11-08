import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface CartItem {
  recipeId: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  add(item: CartItem): void;
  setQuantity(recipeId: number, quantity: number): void;
  remove(recipeId: number): void;
  clear(): void;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      items: [],
      add(item) {
        set((state) => {
          const existing = state.items.find(
            (i) => i.recipeId === item.recipeId,
          );
          if (existing) existing.quantity += item.quantity;
          else state.items.push(item);
        });
      },
      setQuantity(recipeId, quantity) {
        set((state) => {
          const existing = state.items.find((i) => i.recipeId === recipeId);
          if (existing) existing.quantity = Math.max(1, quantity);
        });
      },
      remove(recipeId) {
        set((state) => {
          state.items = state.items.filter((i) => i.recipeId !== recipeId);
        });
      },
      clear() {
        set({ items: [] });
      },
    })),
    { name: "woj-cart" },
  ),
);
