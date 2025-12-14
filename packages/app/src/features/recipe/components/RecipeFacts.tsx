import { getRecipeEnergy } from "@/features/recipe/utils/getRecipeEnergy";
import { RecipeDto } from "@woj/common/dto";
import { ChefHatIcon, CookingPotIcon, ZapIcon } from "lucide-react";

export interface RecipeFactsProps {
  recipe: RecipeDto;
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
