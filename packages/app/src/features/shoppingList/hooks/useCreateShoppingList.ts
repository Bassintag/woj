import {
  CreateShoppingList,
  ShoppingList,
} from "@/features/shoppingList/domain/ShoppingList";
import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export const createShoppingList = (data: CreateShoppingList) => {
  return fetchApi<ShoppingList>("shopping-lists", {
    method: "POST",
    json: data,
  });
};

export const useCreateShoppingList = () => {
  return useMutation({
    mutationFn: createShoppingList,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shopping-lists", "_infinite"],
        exact: false,
      });
    },
  });
};
