import { ShoppingListDto } from "@/features/shoppingList/domain/ShoppingList";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ShoppingItemDto } from "@/features/shoppingList/domain/ShoppingItem";

export interface ShoppingListsState {
  shoppingLists: ShoppingListDto[];

  create(data: ShoppingListDto): void;
  delete(id: string): void;
  createItem(id: string, item: ShoppingItemDto): void;
  setItems(id: string, items: ShoppingItemDto[]): void;
  setItem(id: string, itemId: string, item: ShoppingItemDto): void;
  deleteItem(id: string, itemId: string): void;
}

export const useShoppingListsState = create(
  persist(
    immer<ShoppingListsState>((set) => ({
      shoppingLists: [],
      create: (data) => {
        set((state: ShoppingListsState) => {
          state.shoppingLists.unshift(data);
        });
      },
      delete: (id) => {
        set((state: ShoppingListsState) => {
          state.shoppingLists = state.shoppingLists.filter(
            (item) => item.id !== id,
          );
        });
      },
      createItem(id: string, item: ShoppingItemDto): void {
        set((state: ShoppingListsState) => {
          state.shoppingLists.find((list) => list.id === id)?.items.push(item);
        });
      },
      deleteItem(id: string, itemId: string): void {
        set((state: ShoppingListsState) => {
          const list = state.shoppingLists.find((list) => list.id === id);
          if (!list) return;
          list.items = list.items.filter((item) => item.id !== itemId);
        });
      },
      setItem(id: string, itemId: string, item: ShoppingItemDto): void {
        set((state: ShoppingListsState) => {
          const list = state.shoppingLists.find((list) => list.id === id);
          if (!list) return;
          const itemIndex = list.items.findIndex((item) => item.id === itemId);
          if (itemIndex < 0) return;
          list.items.splice(itemIndex, 1, item);
        });
      },
      setItems(id: string, items: ShoppingItemDto[]): void {
        set((state: ShoppingListsState) => {
          const list = state.shoppingLists.find((list) => list.id === id);
          if (!list) return;
          list.items = items;
        });
      },
    })),
    {
      name: "woj:shoppingLists",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
