import {
  ShoppingItem,
  UpdateShoppingItem,
} from "@/features/shoppingList/domain/ShoppingItem";
import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export interface UpdateShoppingItemParam extends UpdateShoppingItem {
  shoppingListId: string;
  id: string;
}

export const updateShoppingItem = ({
  shoppingListId,
  id,
  ...data
}: UpdateShoppingItemParam) => {
  return fetchApi<ShoppingItem>(
    `shopping-lists/${shoppingListId}/items/${id}`,
    {
      method: "PATCH",
      json: data,
    },
  );
};

export const useUpdateShoppingItem = () => {
  return useMutation({
    mutationFn: updateShoppingItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shopping-lists"],
        exact: false,
      });
    },
  });
};
