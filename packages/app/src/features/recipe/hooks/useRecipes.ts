import { GetRecipePageQuery, Recipe } from "@/features/recipe/domain/Recipe";
import { fetchApi } from "@/utils/fetchApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Page } from "@/domain/Page";

export const getRecipes = (query: GetRecipePageQuery) => {
  return fetchApi<Page<Recipe>>("recipes", { query });
};

export const useRecipes = (query?: Omit<GetRecipePageQuery, "page">) => {
  return useInfiniteQuery({
    queryKey: ["recipes", query],
    queryFn: ({ pageParam }) => getRecipes({ ...query, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (data) => {
      if (data.page >= data.pages - 1) {
        return null;
      }
      return data.page + 1;
    },
  });
};
