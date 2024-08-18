import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export interface DeleteShoppingItemParam {
  shoppingListId: number;
  id: number;
}

export const deleteShoppingItem = ({
  shoppingListId,
  id,
}: DeleteShoppingItemParam) => {
  return fetchApi<void>(`shopping-lists/${shoppingListId}/items/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteShoppingItem = () => {
  return useMutation({
    mutationFn: deleteShoppingItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shopping-lists"],
        exact: false,
      });
    },
  });
};
