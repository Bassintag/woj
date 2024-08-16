import { Menu } from "@/features/menu/domain/Menu";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface MenuPageState {
  menu?: Menu;
  quantity: number;
  tags: string[];

  setMenu: (menu: Menu) => void;
  setQuantity: (quantity: number) => void;
  setTags: (tags: string[]) => void;
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
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
