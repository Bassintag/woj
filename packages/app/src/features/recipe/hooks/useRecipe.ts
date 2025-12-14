import { fetchApi } from "@/utils/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { RecipeDto } from "@woj/common/dto";

export const getRecipe = (id: number) => {
  return fetchApi<RecipeDto>(`recipes/${id}`);
};

export const useRecipe = (id: number) => {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipe(id),
  });
};
