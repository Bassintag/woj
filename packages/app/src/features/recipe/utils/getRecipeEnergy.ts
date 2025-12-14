import { RecipeDto } from "@woj/common/dto";

export const getRecipeEnergy = (recipe: RecipeDto) => {
  return recipe.energy;
};
