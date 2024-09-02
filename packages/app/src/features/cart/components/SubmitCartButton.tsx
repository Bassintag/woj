import { useCartState } from "@/features/cart/hook/useCartState";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";
import { v4 } from "uuid";
import { formatWithUnit } from "@/features/unit/utils/formatWithUnit";
import { RecipeIngredient } from "@/features/recipe/domain/Recipe";

export interface SubmitCartButtonProps {
  closeDrawer: () => void;
}

export const SubmitCartButton = ({ closeDrawer }: SubmitCartButtonProps) => {
  const [items, resetCart] = useCartState((s) => [s.items, s.reset]);
  const createList = useShoppingListsState((s) => s.create);
  const navigate = useNavigate();

  const handleClick = () => {
    const id = v4();
    const ingredients: Record<string, Omit<RecipeIngredient, "id">> = {};
    for (const item of items) {
      for (const recipeIngredient of item.recipe.ingredients) {
        const existing = ingredients[recipeIngredient.ingredient.id];
        const quantity = item.quantity * recipeIngredient.quantity;
        if (existing) {
          existing.quantity += quantity;
        } else {
          ingredients[recipeIngredient.ingredient.id] = {
            ingredient: recipeIngredient.ingredient,
            quantity,
          };
        }
      }
    }
    createList({
      id,
      createdAt: new Date().toISOString(),
      items: Object.values(ingredients)
        .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name))
        .map(({ ingredient, quantity }) => ({
          id: v4(),
          name: `${formatWithUnit(ingredient.unit, quantity)} ${ingredient.name}`,
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
