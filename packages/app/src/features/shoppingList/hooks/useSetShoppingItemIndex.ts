import {
  ShoppingItem,
  SetShoppingItemIndex,
} from "@/features/shoppingList/domain/ShoppingItem";
import { fetchApi } from "@/utils/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";
import { ShoppingList } from "@/features/shoppingList/domain/ShoppingList";
import { arrayMove } from "@dnd-kit/sortable";

export interface SetShoppingItemIndexParam extends SetShoppingItemIndex {
  shoppingListId: string;
  id: string;
}

export const setShoppingItemIndex = ({
  shoppingListId,
  id,
  ...data
}: SetShoppingItemIndexParam) => {
  return fetchApi<ShoppingItem>(
    `shopping-lists/${shoppingListId}/items/${id}/index`,
    {
      method: "PUT",
      json: data,
    },
  );
};

export const useSetShoppingItemIndex = () => {
  return useMutation({
    mutationFn: setShoppingItemIndex,
    onMutate: ({ shoppingListId, id, index }) => {
      const key = ["shopping-lists", shoppingListId];
      const list = queryClient.getQueryData<ShoppingList>(key);
      if (list == null) return;
      const from = list.items.findIndex((item) => item.id === id);
      if (from < 0) return;
      queryClient.setQueryData(key, {
        ...list,
        items: arrayMove(list.items, from, index),
      });
      return list;
    },
    onError: (_err, { shoppingListId }, context) => {
      if (context == null) return;
      const key = ["shopping-lists", shoppingListId];
      queryClient.setQueryData(key, context);
    },
  });
};
