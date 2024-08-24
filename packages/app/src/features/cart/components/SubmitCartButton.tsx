import { useCartState } from "@/features/cart/hook/useCartState";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";
import { v4 } from "uuid";
import { formatWithUnit } from "@/features/unit/utils/formatWithUnit";

export interface SubmitCartButtonProps {
  closeDrawer: () => void;
}

export const SubmitCartButton = ({ closeDrawer }: SubmitCartButtonProps) => {
  const [items, resetCart] = useCartState((s) => [s.items, s.reset]);
  const createList = useShoppingListsState((s) => s.create);
  const navigate = useNavigate();

  const handleClick = () => {
    const id = v4();
    createList({
      id,
      createdAt: new Date().toISOString(),
      items: items
        .map((item) =>
          item.recipe.ingredients.map(({ ingredient, quantity }) => ({
            id: v4(),
            name: `${formatWithUnit(ingredient.unit, quantity * item.quantity)} ${ingredient.name}`,
            purchased: false,
            ingredient,
          })),
        )
        .flat(),
      recipes: items.map((item) => item.recipe),
    });
    closeDrawer();
    resetCart();
    navigate(`/shopping-lists/${id}`);
  };

  return (
    items.length > 0 && (
      <Button className="mt-auto shrink-0" onClick={handleClick}>
        Créer la liste de course
      </Button>
    )
  );
};
