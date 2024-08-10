import { useParams } from "react-router-dom";
import { useRecipe } from "@/features/recipe/hooks/useRecipe";

export const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe } = useRecipe(id as string);

  return (
    <div className="container">
      {recipe && <h1 className="font-display text-4xl">{recipe.name}</h1>}
    </div>
  );
};

export const element = <RecipePage />;
