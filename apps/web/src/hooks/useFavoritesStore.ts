import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavoritesState {
  ids: number[];
  toggle(id: number): void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle(id) {
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((i) => i !== id)
            : [...state.ids, id],
        }));
      },
    }),
    { name: "woj-favorites" },
  ),
);
