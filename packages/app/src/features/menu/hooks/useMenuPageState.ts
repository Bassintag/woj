import { Menu } from "@/features/menu/domain/Menu";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface MenuPageState {
  menu?: Menu;
  quantity: number;
  tags: number[];

  setMenu: (menu: Menu) => void;
  setQuantity: (quantity: number) => void;
  setTags: (tags: number[]) => void;
}

export const useMenuPageState = create(
  persist<MenuPageState>(
    (set) => ({
      quantity: 7,
      tags: [],

      setMenu: (menu) => set({ menu }),
      setQuantity: (quantity) => set({ quantity }),
      setTags: (tags) => set({ tags }),
    }),
    {
      name: "woj:menu-page",
      version: 2,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
