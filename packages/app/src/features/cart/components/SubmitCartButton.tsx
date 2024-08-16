import { useCartState } from "@/features/cart/hook/useCartState";
import { Button } from "@/components/Button";
import { useCreateShoppingList } from "@/features/shoppingList/hooks/useCreateShoppingList";
import { useNavigate } from "react-router-dom";

export const SubmitCartButton = () => {
  const [items, resetCart] = useCartState((s) => [s.items, s.reset]);
  const { mutate: createShoppingList, isPending } = useCreateShoppingList();
  const navigate = useNavigate();

  const handleClick = () => {
    return createShoppingList(
      {
        recipes: items.map((item) => ({
          id: item.recipe.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (list) => {
          resetCart();
          navigate(`/shopping-lists/${list.id}`);
        },
      },
    );
  };

  return (
    items.length > 0 && (
      <Button
        className="mt-auto shrink-0"
        onClick={handleClick}
        disabled={isPending}
      >
        Créer la liste de course
      </Button>
    )
  );
};
