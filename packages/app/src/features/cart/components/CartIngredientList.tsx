import { useMemo, useState } from "react";
import { Ingredient } from "@/features/recipe/domain/Recipe";
import { useCartState } from "@/features/cart/hook/useCartState";
import { Image } from "@/components/Image";
import { formatWithUnit } from "@/features/unit/utils/formatWithUnit";

interface CartIngredient {
  quantity: number;
  ingredient: Ingredient;
}

export const CartIngredientList = () => {
  const items = useCartState((s) => s.items);

  const ingredients = useMemo(() => {
    const ingredientMap: Record<string, CartIngredient> = {};

    for (const item of items) {
      for (const recipeIngredient of item.recipe.ingredients) {
        const { ingredient } = recipeIngredient;
        const quantity = recipeIngredient.quantity * item.quantity;
        const existing = ingredientMap[ingredient.id];
        if (existing) {
          existing.quantity += quantity;
        } else {
          ingredientMap[ingredient.id] = { ingredient, quantity };
        }
      }
    }

    return Object.values(ingredientMap).toSorted((a, b) =>
      a.ingredient.name.localeCompare(b.ingredient.name),
    );
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
          {formatWithUnit(
            cartIngredient.ingredient.unit,
            cartIngredient.quantity,
          )}
        </div>
      </div>
    </li>
  );
};
