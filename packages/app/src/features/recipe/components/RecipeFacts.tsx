import { Recipe } from "@/features/recipe/domain/Recipe";
import { ChefHatIcon, CookingPotIcon, TimerIcon, ZapIcon } from "lucide-react";
import { getRecipeEnergy } from "@/features/recipe/utils/getRecipeEnergy";

export interface RecipeFactsProps {
  recipe: Recipe;
}

export const RecipeFacts = ({ recipe }: RecipeFactsProps) => {
  const energy = getRecipeEnergy(recipe);
  return (
    <div className="container flex flex-row justify-center gap-3">
      {recipe.preppingTime != null && (
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <ChefHatIcon />
          <div>{recipe.preppingTime} min</div>
        </div>
      )}
      {recipe.cookingTime != null && (
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <CookingPotIcon />
          <div>{recipe.cookingTime} min</div>
        </div>
      )}
      <div className="flex-1 flex flex-col items-center gap-1.5">
        <ZapIcon />
        <div>{energy} kCal</div>
      </div>
    </div>
  );
};
