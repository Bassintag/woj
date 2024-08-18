import {
  CreateShoppingItem,
  ShoppingItem,
} from "@/features/shoppingList/domain/ShoppingItem";
import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export interface CreateShoppingItemParam extends CreateShoppingItem {
  shoppingListId: number;
}

export const createShoppingItem = ({
  shoppingListId,
  ...data
}: CreateShoppingItemParam) => {
  return fetchApi<ShoppingItem>(`shopping-lists/${shoppingListId}/items`, {
    method: "POST",
    json: data,
  });
};

export const useCreateShoppingItem = () => {
  return useMutation({
    mutationFn: createShoppingItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shopping-lists"],
        exact: false,
      });
    },
  });
};
