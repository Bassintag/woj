import {
  ShoppingItem,
  UpdateShoppingItem,
} from "@/features/shoppingList/domain/ShoppingItem";
import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";
import { ShoppingList } from "@/features/shoppingList/domain/ShoppingList";

export interface UpdateShoppingItemParam extends UpdateShoppingItem {
  shoppingListId: number;
  id: number;
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
    mutationKey: ["shopping-items", "update"],
    mutationFn: updateShoppingItem,
    onMutate: ({ id, shoppingListId, ...values }) => {
      const key = ["shopping-lists", shoppingListId];
      const shoppingList = queryClient.getQueryData<ShoppingList>(key);
      if (shoppingList == null) return;
      const index = shoppingList.items.findIndex((item) => item.id === id);
      if (index < 0) return;
      const listCopy = [...shoppingList.items];
      const copy = { ...listCopy[index] };
      Object.assign(copy, values);
      listCopy[index] = copy;
      queryClient.setQueryData(key, { ...shoppingList, items: listCopy });
      const mutations = queryClient.getMutationCache().findAll({
        mutationKey: ["shopping-items", "update"],
        status: "pending",
      });
      console.log(mutations);
      const duplicateMutations = mutations
        .filter((m) => {
          const variables = m.state.variables as UpdateShoppingItemParam;
          if (variables.id !== id) return false;
          for (const keys of Object.keys(values)) {
            if (keys in variables) return true;
          }
          return false;
        })
        .slice(0, -1);
      for (const mutation of duplicateMutations) {
        queryClient.getMutationCache().remove(mutation);
      }
      return shoppingList;
    },
    onError: (_err, { shoppingListId }, context) => {
      if (context == null) return;
      queryClient.setQueryData(["shopping-lists", shoppingListId], context);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shopping-lists"],
        exact: false,
      });
    },
  });
};
