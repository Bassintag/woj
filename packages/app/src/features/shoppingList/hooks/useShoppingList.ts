import { fetchApi } from "@/utils/fetchApi";
import { ShoppingList } from "@/features/shoppingList/domain/ShoppingList";
import { useQuery } from "@tanstack/react-query";

export const getShoppingList = (id: number) => {
  return fetchApi<ShoppingList>(`shopping-lists/${id}`);
};

export const useShoppingList = (id: number) => {
  return useQuery({
    queryKey: ["shopping-lists", id],
    queryFn: () => getShoppingList(id),
  });
};
