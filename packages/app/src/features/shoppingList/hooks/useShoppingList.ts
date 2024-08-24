import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";

export const useShoppingList = (id: string) => {
  return useShoppingListsState((s) => s.shoppingLists.find((l) => l.id === id));
};
