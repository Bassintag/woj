import { BasketIcon } from "@phosphor-icons/react";
import type { Menu } from "@woj/contract";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/hooks/useCartStore";

export function MenuActions({
  menu,
  quantities,
  onAdded,
}: {
  menu: Menu;
  quantities: Record<number, number>;
  onAdded: () => void;
}) {
  const add = useCartStore((state) => state.add);

  return (
    <footer className="sticky bottom-0 mt-auto flex flex-row items-center gap-4 rounded-4xl bg-bg px-layout py-6 shadow-base">
      <Button
        className="flex-1"
        variant="brand"
        onClick={() => {
          for (const meal of menu.meals) {
            add({ recipeId: meal.recipe.id, quantity: quantities[meal.id] });
          }
          onAdded();
        }}
      >
        <BasketIcon />
        Ajouter au panier
      </Button>
    </footer>
  );
}
