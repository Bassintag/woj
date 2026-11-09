import {
  BasketIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Stepper, StepperButton, StepperValue } from "@/components/ui/Stepper";
import { useCartStore } from "@/hooks/useCartStore";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { useServingsStore } from "@/hooks/useServingsStore";

const Route = getRouteApi("/$id/");

export function RecipeActions() {
  const id = Route.useParams({ select: (p) => p.id });
  const servings = useServingsStore((state) => state.servings);
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.recipeId === id)?.quantity,
  );
  const add = useCartStore((state) => state.add);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const remove = useCartStore((state) => state.remove);

  const isFavorite = useFavoritesStore((state) => state.ids.includes(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  const favorite = (
    <Button
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={() => toggleFavorite(id)}
    >
      <HeartIcon weight={isFavorite ? "fill" : "regular"} />
    </Button>
  );

  if (quantity !== undefined) {
    return (
      <footer className="sticky bottom-0 mt-auto flex flex-col gap-4 rounded-4xl bg-bg px-layout py-6 shadow-base">
        <p className="text-center text-md text-fg">
          Cette recette est dans votre panier
        </p>
        <div className="flex flex-row items-start justify-between">
          <Button aria-label="Retirer du panier" onClick={() => remove(id)}>
            <TrashIcon />
          </Button>
          <Stepper>
            <StepperButton
              aria-label="Diminuer"
              disabled={quantity <= 1}
              onClick={() => setQuantity(id, quantity - 1)}
            >
              <MinusIcon />
            </StepperButton>
            <StepperValue>{quantity} pers.</StepperValue>
            <StepperButton
              aria-label="Augmenter"
              onClick={() => setQuantity(id, quantity + 1)}
            >
              <PlusIcon />
            </StepperButton>
          </Stepper>
          {favorite}
        </div>
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
      {favorite}
    </footer>
  );
}
