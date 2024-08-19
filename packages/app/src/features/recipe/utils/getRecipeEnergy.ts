import { Recipe } from "@/features/recipe/domain/Recipe";

export const getRecipeEnergy = (recipe: Recipe) => {
  return Math.round(
    recipe.ingredients.reduce((prev, { ingredient, quantity }) => {
      return prev + (ingredient.energy ?? 0) * quantity;
    }, 0),
  );
};
