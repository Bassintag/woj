import { Recipe } from "@/features/recipe/domain/Recipe";

export const getRecipeTime = (recipe: Recipe) => {
  return (recipe.preppingTime ?? 0) + (recipe.cookingTime ?? 0);
};
