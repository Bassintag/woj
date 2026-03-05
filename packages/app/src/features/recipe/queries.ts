import { Page } from "@/domain/Page";
import { fetchApi } from "@/utils/fetchApi";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  RecipeDetailsDto,
  RecipeDto,
  RecipePageQueryDto,
} from "@woj/common/dto";

export const recipeKeys = {
  id: (id: number) => ["recipes", id],
  infinite: (query?: Omit<RecipePageQueryDto, "page">) => [
    "recipes",
    "_infinite",
    query,
  ],
};

export const recipeOptions = (id: number) => {
  return queryOptions({
    queryKey: recipeKeys.id(id),
    queryFn: () => fetchApi<RecipeDetailsDto>(`recipes/${id}`),
  });
};

export const recipesOptions = (query?: Omit<RecipePageQueryDto, "page">) => {
  return infiniteQueryOptions({
    queryKey: recipeKeys.infinite(query),
    queryFn: ({ pageParam }) => {
      return fetchApi<Page<RecipeDto>>("recipes", {
        query: { page: pageParam, ...query },
      });
    },
    initialPageParam: 0,
    getNextPageParam: (data) => {
      if (data.page >= data.pages - 1) return null;
      return data.page + 1;
    },
  });
};
