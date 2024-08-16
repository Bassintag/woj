import { Link } from "react-router-dom";
import { useRecipe } from "@/features/recipe/hooks/useRecipe";
import { IngredientList } from "@/features/recipe/components/IngredientList";
import { StepList } from "@/features/recipe/components/StepList";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import {
  ArrowLeftIcon,
  ForkKnifeIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { useRecipePageState } from "@/features/recipe/hooks/useRecipePageState";
import { RecipeFacts } from "@/features/recipe/components/RecipeFacts";
import { RecipeCartButton } from "@/features/recipe/components/RecipeCartButton";
import { useIdParam } from "@/hooks/useIdParam";
import { PageTitle } from "@/features/recipe/components/PageTitle";

export const RecipePage = () => {
  const id = useIdParam();
  const { data: recipe } = useRecipe(id);
  const { quantity, setQuantity } = useRecipePageState();

  return (
    <>
      <div className="container py-6">
        <PageTitle linkTo="/">{recipe?.name}</PageTitle>
      </div>
      {recipe && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-6 mx-auto w-64 lg:w-96 font-medium text-2xl">
            <Image
              className="size-64 lg:size-96 rounded-xl"
              path={recipe.imagePath}
            />
            <div className="flex flex-row items-center gap-6">
              <Button
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
                className="shadow-lg"
                variant="icon"
                size="lg"
              >
                <MinusIcon />
              </Button>
              <div className="flex flex-row gap-3 items-center">
                <ForkKnifeIcon className="size-6" />
                <span className="font-semibold">{quantity}</span>
              </div>
              <Button
                onClick={() => setQuantity(quantity + 1)}
                className="shadow-lg"
                variant="icon"
                size="lg"
              >
                <PlusIcon />
              </Button>
            </div>
            <RecipeCartButton recipe={recipe} />
          </div>
          <div className="bg-stone-100 py-6">
            <RecipeFacts recipe={recipe} />
          </div>
          <div className="container flex flex-col gap-6 mb-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-center font-semibold text-xl">Ingredients</h2>
              <IngredientList ingredients={recipe.ingredients} />
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
