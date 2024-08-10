import { useParams } from "react-router-dom";
import { useRecipe } from "@/features/recipe/hooks/useRecipe";
import { Card } from "@/components/Card";
import { IngredientList } from "@/features/recipe/components/IngredientList";
import { StepList } from "@/features/recipe/components/StepList";

export const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe } = useRecipe(id as string);

  return (
    <div className="container flex flex-col gap-6 py-6">
      {recipe && (
        <>
          <h1 className="font-display text-3xl">{recipe.name}</h1>
          <Card className="flex flex-col gap-3">
            <h2 className="text-center font-semibold text-xl">Ingredients</h2>
            <IngredientList ingredients={recipe.ingredients} />
          </Card>
          <Card>
            <h2 className="text-center font-semibold text-xl">Instructions</h2>
            <StepList steps={recipe.steps} />
          </Card>
        </>
      )}
    </div>
  );
};

export const element = <RecipePage />;
