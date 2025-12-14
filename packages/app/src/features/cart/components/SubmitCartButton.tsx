import { useCartState } from "@/features/cart/hook/useCartState";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";
import { v4 } from "uuid";
import { formatWithUnit } from "@/features/unit/utils/formatWithUnit";
import { ConstituentDto } from "@woj/common/dto";
import { useShallow } from "zustand/shallow";

export interface SubmitCartButtonProps {
  closeDrawer: () => void;
}

export const SubmitCartButton = ({ closeDrawer }: SubmitCartButtonProps) => {
  const [items, resetCart] = useCartState(
    useShallow((s) => [s.items, s.reset]),
  );
  const createList = useShoppingListsState((s) => s.create);
  const navigate = useNavigate();

  const handleClick = () => {
    const id = v4();
    const constituents: Record<string, Omit<ConstituentDto, "id">> = {};
    for (const item of items) {
      for (const constituent of item.recipe.constituents) {
        const existing = constituents[constituent.ingredient.id];
        const quantity = item.quantity * constituent.quantity;
        if (existing) {
          existing.quantity += quantity;
        } else {
          constituents[constituent.id] = {
            ingredient: constituent.ingredient,
            unit: constituent.unit,
            quantity,
          };
        }
      }
    }
    createList({
      id,
      createdAt: new Date().toISOString(),
      items: Object.values(constituents)
        .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name))
        .map(({ ingredient, quantity, unit }) => ({
          id: v4(),
          name: `${formatWithUnit(unit, quantity)} ${ingredient.name}`,
          purchased: false,
          ingredient,
        })),
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
