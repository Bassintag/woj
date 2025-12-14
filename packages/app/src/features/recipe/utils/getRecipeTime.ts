import { RecipeDto } from "@woj/common/dto";

export const getRecipeTime = (recipe: RecipeDto) => {
  return (recipe.preppingTime ?? 0) + (recipe.cookingTime ?? 0);
};
