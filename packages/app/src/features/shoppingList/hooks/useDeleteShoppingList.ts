import {
  CreateShoppingList,
  ShoppingList,
} from "@/features/shoppingList/domain/ShoppingList";
import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export const deleteShoppingList = (id: number) => {
  return fetchApi<ShoppingList>(`shopping-lists/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteShoppingList = () => {
  return useMutation({
    mutationFn: deleteShoppingList,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shopping-lists", "_infinite"],
        exact: false,
      });
    },
  });
};
