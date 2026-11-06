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
    }),
    { name: "woj-list" },
  ),
);
