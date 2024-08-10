import { Ingredient, RecipeIngredient } from "@/features/recipe/domain/Recipe";
import { getImageUrl } from "@/utils/getImageUrl";
import { Image } from "@/components/Image";

export interface IngredientListProps {
  ingredients: RecipeIngredient[];
}

export const IngredientList = ({ ingredients }: IngredientListProps) => {
  return (
    <ul className="flex flex-row flex-wrap justify-center items-start gap-6">
      {ingredients.map((ingredient) => (
        <IngredientListRow key={ingredient.id} ingredient={ingredient} />
      ))}
    </ul>
  );
};

export interface IngredientListRowProps {
  ingredient: RecipeIngredient;
}

export const IngredientListRow = ({ ingredient }: IngredientListRowProps) => {
  return (
    <li className="flex flex-col gap-1.5 items-center shrink-0 w-24 text-center">
      <Image
        className="rounded-full w-16 h-16"
        alt={ingredient.ingredient.name}
        path={ingredient.ingredient.imagePath}
      />
      <h3 className="text-sm font-medium leading-4">
        {ingredient.ingredient.name}
      </h3>
    </li>
  );
};
