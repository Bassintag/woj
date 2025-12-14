import { Image } from "@/components/Image";
import { useCartState } from "@/features/cart/hook/useCartState";
import {
  convertQuantity,
  getNormalizedQuantity,
} from "@/features/constituent/utils";
import { formatWithUnit } from "@/features/unit/utils/formatWithUnit";
import { IngredientDto, UnitDto } from "@woj/common/dto";
import { useMemo } from "react";

interface CartIngredient {
  quantity: number;
  ingredient: IngredientDto;
  unit: UnitDto;
}

export const CartIngredientList = () => {
  const items = useCartState((s) => s.items);

  const ingredients = useMemo(() => {
    const ingredientMap: Record<number, CartIngredient> = {};

    for (const item of items) {
      for (const constituent of item.recipe.constituents) {
        const { ingredient, quantity, unit } = constituent;
        const existing = ingredientMap[ingredient.id];
        if (existing) {
          const converted = getNormalizedQuantity(constituent) * item.quantity;
          existing.quantity = getNormalizedQuantity(existing) + converted;
          existing.unit = existing.ingredient.defaultUnit;
        } else {
          ingredientMap[ingredient.id] = {
            ingredient,
            quantity: quantity * item.quantity,
            unit,
          };
        }
      }
    }

    return Object.values(ingredientMap).toSorted((a, b) => {
      return a.ingredient.name.localeCompare(b.ingredient.name);
    });
  }, [items]);

  return (
    <ul className="flex flex-col gap-1.5">
      {ingredients.map((cartIngredient) => (
        <CartIngredientListRow
          key={cartIngredient.ingredient.id}
          cartIngredient={cartIngredient}
        />
      ))}
    </ul>
  );
};

export interface CartIngredientListRowProps {
  cartIngredient: CartIngredient;
}

export const CartIngredientListRow = ({
  cartIngredient,
}: CartIngredientListRowProps) => {
  return (
    <li className="flex flex-row items-center gap-1.5">
      <Image
        className="rounded-xl w-12 h-12 bg-stone-100"
        path={cartIngredient.ingredient.imagePath}
        alt={cartIngredient.ingredient.name}
      />
      <div>
        <div className="text-sm leading-3">
          {cartIngredient.ingredient.name}
        </div>
        <div className="text-sm text-stone-500">
          {formatWithUnit(cartIngredient.unit, cartIngredient.quantity)}
        </div>
      </div>
    </li>
  );
};
