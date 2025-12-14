import { Image } from "@/components/Image";
import { useRecipePageState } from "@/features/recipe/hooks/useRecipePageState";
import { formatWithUnit } from "@/features/unit/utils/formatWithUnit";
import { ConstituentDto } from "@woj/common/dto";

export interface IngredientListProps {
  constituents: ConstituentDto[];
}

export const IngredientList = ({ constituents }: IngredientListProps) => {
  return (
    <ul className="flex flex-row flex-wrap justify-center items-start gap-6">
      {constituents.map((constituent) => (
        <IngredientListRow key={constituent.id} constituent={constituent} />
      ))}
    </ul>
  );
};

export interface IngredientListRowProps {
  constituent: ConstituentDto;
}

export const IngredientListRow = ({ constituent }: IngredientListRowProps) => {
  const quantity = useRecipePageState((s) => s.quantity);
  return (
    <li className="flex flex-col gap-1.5 items-center shrink-0 w-24 text-center">
      <Image
        className="rounded-full w-16 h-16"
        alt={constituent.ingredient.name}
        path={constituent.ingredient.imagePath}
      />
      <h3 className="text-sm font-medium leading-4">
        {constituent.ingredient.name}
      </h3>
      <p className="text-sm text-stone-600">
        {formatWithUnit(constituent.unit, constituent.quantity * quantity)}
      </p>
    </li>
  );
};
