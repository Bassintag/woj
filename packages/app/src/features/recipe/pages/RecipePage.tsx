import { Image } from "@/components/Image";
import { QuantitySelector } from "@/components/QuantitySelector";
import { IngredientList } from "@/features/recipe/components/IngredientList";
import { PageTitle } from "@/features/recipe/components/PageTitle";
import { RecipeCartButton } from "@/features/recipe/components/RecipeCartButton";
import { RecipeFacts } from "@/features/recipe/components/RecipeFacts";
import { StepList } from "@/features/recipe/components/StepList";
import { useRecipePageState } from "@/features/recipe/hooks/useRecipePageState";
import { TagLabel } from "@/features/tag/components/TagLabel";
import { useIdParam } from "@/hooks/useIdParam";
import { useQuery } from "@tanstack/react-query";
import { TagIcon } from "lucide-react";
import { recipeOptions } from "../queries";

export const RecipePage = () => {
  const id = useIdParam();
  const { data: recipe } = useQuery(recipeOptions(id));
  const { quantity, setQuantity } = useRecipePageState();

  return (
    <>
      <div className="container py-6">
        <PageTitle linkTo="/recipes">{recipe?.name}</PageTitle>
      </div>
      {recipe && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-6 mx-auto w-64 lg:w-96 font-medium text-2xl">
            <Image
              className="size-64 lg:size-96 rounded-xl"
              path={recipe.imagePath}
            />
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <RecipeCartButton recipe={recipe} />
          </div>
          <div className="bg-stone-100 py-6 flex flex-col gap-6">
            <RecipeFacts recipe={recipe} />
          </div>
          {recipe && recipe.tags.length > 0 && (
            <div className="flex flex-row justify-start items-center ml-8 gap-1.5">
              <TagIcon className="size-4" />
              {recipe.tags.map((tag) => (
                <TagLabel key={tag.id} tag={tag} />
              ))}
            </div>
          )}
          <div className="container flex flex-col gap-6 mb-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-center font-semibold text-xl">Ingredients</h2>
              <IngredientList constituents={recipe.constituents} />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-center font-semibold text-xl">
                Instructions
              </h2>
              <StepList steps={recipe.steps} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const element = <RecipePage />;
