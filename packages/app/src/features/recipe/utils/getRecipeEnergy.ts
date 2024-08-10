import { Recipe } from "@/features/recipe/domain/Recipe";

export const getRecipeEnergy = (recipe: Recipe) => {
  return recipe.ingredients.reduce((prev, { ingredient }) => {
    return prev + (ingredient.energy ?? 0);
  }, 0);
};
