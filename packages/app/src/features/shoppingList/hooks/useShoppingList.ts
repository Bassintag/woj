import { fetchApi } from "@/utils/fetchApi";
import { ShoppingList } from "@/features/shoppingList/domain/ShoppingList";
import { useQuery } from "@tanstack/react-query";

export const getShoppingList = (id: string) => {
  return fetchApi<ShoppingList>(`shopping-lists/${id}`);
};

export const useShoppingList = (id: string) => {
  return useQuery({
    queryKey: ["shopping-lists", id],
    queryFn: () => getShoppingList(id),
  });
};
