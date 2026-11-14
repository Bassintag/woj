import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ListItem {
  id: string;
  label: string;
  checked: boolean;
  image?: string;
}

export interface ListRecipe {
  recipeId: number;
  servings: number;
}

interface ListState {
  items: ListItem[];
  recipes: ListRecipe[];
  add(label: string, afterId?: string): void;
  update(id: string, label: string): void;
  toggle(id: string): void;
  remove(id: string): void;
  move(activeId: string, overId: string): void;
  replace(
    items: Pick<ListItem, "label" | "image">[],
    recipes: ListRecipe[],
  ): void;
}

export const useListStore = create<ListState>()(
  persist(
    (set) => ({
      items: [],
      recipes: [],
      add(label, afterId) {
        set((state) => {
          const index = state.items.findIndex((item) => item.id === afterId);
          const item = { id: crypto.randomUUID(), label, checked: false };
          return {
            items:
              index === -1
                ? [...state.items, item]
                : [
                    ...state.items.slice(0, index + 1),
                    item,
                    ...state.items.slice(index + 1),
                  ],
          };
        });
      },
      update(id, label) {
        set((state) => ({
          items: label
            ? state.items.map((item) =>
                item.id === id ? { ...item, label } : item,
              )
            : state.items.filter((item) => item.id !== id),
        }));
      },
      toggle(id) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        }));
      },
      remove(id) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      move(activeId, overId) {
        set((state) => {
          const from = state.items.findIndex((item) => item.id === activeId);
          const to = state.items.findIndex((item) => item.id === overId);
          if (from === -1 || to === -1) return state;
          return { items: arrayMove(state.items, from, to) };
        });
      },
      replace(items, recipes) {
        set({
          recipes,
          items: items.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
            checked: false,
          })),
        });
      },
    }),
    { name: "woj-list" },
  ),
);
