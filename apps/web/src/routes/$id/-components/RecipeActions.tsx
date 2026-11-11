import { BasketIcon, TrashIcon } from "@phosphor-icons/react";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/hooks/useCartStore";
import { useServingsStore } from "@/hooks/useServingsStore";

const Route = getRouteApi("/$id/");

export function RecipeActions() {
  const id = Route.useParams({ select: (p) => p.id });
  const servings = useServingsStore((state) => state.servings);
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.recipeId === id)?.quantity,
  );
  const add = useCartStore((state) => state.add);
  const remove = useCartStore((state) => state.remove);

  if (quantity !== undefined) {
    return (
      <footer className="sticky bottom-0 mt-auto flex flex-row items-center gap-4 rounded-4xl bg-bg px-layout py-6 shadow-base">
        <Button className="flex-1" onClick={() => remove(id)}>
          <TrashIcon />
          Supprimer du panier
        </Button>
      </footer>
    );
  }

  return (
    <footer className="sticky bottom-0 mt-auto flex flex-row items-center gap-4 rounded-4xl bg-bg px-layout py-6 shadow-base">
      <Button
        className="flex-1"
        variant="brand"
        onClick={() => add({ recipeId: id, quantity: servings })}
      >
        <BasketIcon />
        Ajouter au panier
      </Button>
    </footer>
  );
}
