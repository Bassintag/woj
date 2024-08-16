import { Recipe } from "@/features/recipe/domain/Recipe";
import { Button } from "@/components/Button";
import { useCartState } from "@/features/cart/hook/useCartState";
import { useMemo } from "react";
import { useRecipePageState } from "@/features/recipe/hooks/useRecipePageState";

export interface RecipeCartButtonProps {
  recipe: Recipe;
}

export const RecipeCartButton = ({ recipe }: RecipeCartButtonProps) => {
  const [items, set, remove] = useCartState((s) => [s.items, s.set, s.remove]);
  const quantity = useRecipePageState((s) => s.quantity);
  const item = useMemo(
    () => items.find((item) => item.recipe.id === recipe.id),
    [items, recipe],
  );

  const inCart = item != null;
  const exactQuantity = inCart && item.quantity === quantity;

  return (
    <Button
      onClick={() => (exactQuantity ? remove(recipe) : set(recipe, quantity))}
      className="self-stretch"
    >
      {inCart
        ? exactQuantity
          ? "Supprimer du panier"
          : "Modifier la quantité"
        : "Ajouter au panier"}
    </Button>
  );
};
