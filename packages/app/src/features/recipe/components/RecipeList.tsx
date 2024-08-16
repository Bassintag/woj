import { Recipe } from "@/features/recipe/domain/Recipe";
import { Link } from "react-router-dom";
import { ClockIcon } from "lucide-react";
import { getRecipeTime } from "@/features/recipe/utils/getRecipeTime";
import { Image } from "@/components/Image";

export interface RecipeListProps {
  backLink?: string;
  recipes: Recipe[];
}

export const RecipeList = ({ backLink, recipes }: RecipeListProps) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-stretch justify-items-center">
      {recipes.map((recipe) => (
        <RecipeListRow key={recipe.id} backLink={backLink} recipe={recipe} />
      ))}
    </ul>
  );
};

export interface RecipeListRowProps {
  backLink?: string;

  recipe: Recipe;
}

export const RecipeListRow = ({ backLink, recipe }: RecipeListRowProps) => {
  const time = getRecipeTime(recipe);

  return (
    <li className="relative">
      <Link
        to={`/recipes/${recipe.id}${backLink ? `?back=${backLink}` : ""}`}
        className="group flex flex-col h-full w-40"
      >
        <Image
          className="h-40 bg-stone-50 p-1.5 rounded-3xl z-10 self-center object-contain group-hover:bg-stone-100 transition"
          alt={recipe.name}
          path={recipe.imagePath}
        />
        <div className="flex flex-row items-center gap-1 text-stone-300 mt-auto">
          <ClockIcon className="size-4 fill-stone-300 stroke-white" />
          <span className="text-sm font-medium">{time}min</span>
        </div>
        <div className="grow flex flex-col items-center gap-1 py-1.5">
          <h3 className="text-center font-medium text-stone-500 leading-4">
            {recipe.name}
          </h3>
        </div>
      </Link>
    </li>
  );
};
