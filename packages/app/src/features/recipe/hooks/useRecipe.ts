import { fetchApi } from "@/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "@/features/recipe/domain/Recipe";

export const getRecipe = (id: string) => {
  return fetchApi<Recipe>(`recipes/${id}`);
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipe(id),
  });
};
