import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ListItem {
  id: string;
  label: string;
  checked: boolean;
  image?: string;
}

interface ListState {
  items: ListItem[];
  add(label: string): void;
  update(id: string, label: string): void;
  toggle(id: string): void;
  remove(id: string): void;
  move(activeId: string, overId: string): void;
}

export const useListStore = create<ListState>()(
  persist(
    (set) => ({
      items: [],
      add(label) {
        set((state) => ({
          items: [
            ...state.items,
            { id: crypto.randomUUID(), label, checked: false },
          ],
        }));
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
    }),
    { name: "woj-list" },
  ),
);
