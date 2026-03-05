import { Button } from "@/components/Button";
import { useCartState } from "@/features/cart/hook/useCartState";
import { useRecipePageState } from "@/features/recipe/hooks/useRecipePageState";
import { RecipeDetailsDto } from "@woj/common/dto";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";

export interface RecipeCartButtonProps {
  recipe: RecipeDetailsDto;
}

export const RecipeCartButton = ({ recipe }: RecipeCartButtonProps) => {
  const [items, set, remove] = useCartState(
    useShallow((s) => [s.items, s.set, s.remove]),
  );
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
