import {
  GetShoppingListPageQuery,
  ShoppingList,
} from "@/features/shoppingList/domain/ShoppingList";
import { fetchApi } from "@/utils/fetchApi";
import { Page } from "@/domain/Page";
import { useInfiniteQuery } from "@tanstack/react-query";

export const getShoppingLists = (query?: GetShoppingListPageQuery) => {
  return fetchApi<Page<ShoppingList>>("shopping-lists", { query });
};

export const useShoppingLists = (
  query?: Omit<GetShoppingListPageQuery, "page">,
) => {
  return useInfiniteQuery({
    queryKey: ["shopping-lists", "_infinite", query],
    queryFn: ({ pageParam }) => getShoppingLists({ ...query, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (data) => {
      if (data.page >= data.pages - 1) return null;
      return data.page + 1;
    },
  });
};
