import { Recipe } from "@/features/recipe/domain/Recipe";
import { getImageUrl } from "@/utils/getImageUrl";
import { Link } from "react-router-dom";
import { ClockIcon, FlashlightIcon, ZapIcon } from "lucide-react";
import { getRecipeTime } from "@/features/recipe/utils/getRecipeTime";
import { Tag } from "@/components/Tag";
import { getRecipeEnergy } from "@/features/recipe/utils/getRecipeEnergy";
import { Image } from "@/components/Image";

export interface RecipeListProps {
  recipes: Recipe[];
}

export const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-stretch">
      {recipes.map((recipe) => (
        <RecipeListRow key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  );
};

export interface RecipeListRowProps {
  recipe: Recipe;
}

export const RecipeListRow = ({ recipe }: RecipeListRowProps) => {
  const time = getRecipeTime(recipe);
  const energy = getRecipeEnergy(recipe);

  return (
    <li className="relative">
      <Link to={`/${recipe.id}`} className="group flex flex-col h-full">
        <Image
          className="w-48 h-48 z-10 self-center object-contain group-hover:-translate-y-2 transition"
          alt={recipe.name}
          path={recipe.imagePath}
        />
        <div className="grow flex flex-col gap-4 pt-32 -mt-32 bg-white rounded-xl p-3 group-hover:bg-slate-50 group-active:bg-slate-100 transition">
          <h3 className="font-display leading-4 text-center text-lg text-slate-700">
            {recipe.name}
          </h3>
          <div className="flex flex-row gap-3 mt-auto">
            {time && (
              <Tag>
                <ClockIcon className="size-3.5" />
                <span>{time} min</span>
              </Tag>
            )}
            {energy && (
              <Tag>
                <ZapIcon className="size-3.5" />
                <span>{energy} kcal</span>
              </Tag>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
