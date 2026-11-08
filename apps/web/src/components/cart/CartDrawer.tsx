import {
  MinusIcon,
  NotepadIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { Stepper, StepperButton, StepperValue } from "@/components/ui/Stepper";
import { useCartStore } from "@/hooks/useCartStore";
import { useRecipeSearch } from "@/hooks/useRecipeIndex";
import { image } from "@/lib/image";

function plural(count: number, word: string) {
  return `${count} ${word}${count > 1 ? "s" : ""}`;
}

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const portions = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <DrawerContent>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <DrawerTitle>Panier</DrawerTitle>
          <DrawerDescription>
            {plural(items.length, "recette")} - {plural(portions, "portion")}
          </DrawerDescription>
        </div>
        <DrawerClose render={<Button aria-label="Fermer" />}>
          <XIcon />
        </DrawerClose>
      </div>
      <div className="-mx-8 min-h-0 flex-1 overflow-y-auto px-8">
        {items.length ? (
          <Suspense>
            <CartLines />
          </Suspense>
        ) : (
          <p className="text-md text-muted-fg">Le panier est vide.</p>
        )}
      </div>
      <Button variant="brand" disabled={!items.length}>
        <NotepadIcon />
        Créer la liste de courses
      </Button>
    </DrawerContent>
  );
}

function CartLines() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const remove = useCartStore((state) => state.remove);
  const { get } = useRecipeSearch();

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => {
        const recipe = get(item.recipeId);
        return (
          <li className="flex flex-row items-center gap-4" key={item.recipeId}>
            <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-muted-bg">
              {recipe.imageUrl && (
                <img
                  className="size-full object-cover"
                  alt=""
                  src={image(recipe.imageUrl)}
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <h3 className="line-clamp-2 text-md text-fg">{recipe.title}</h3>
              <div className="flex flex-row items-end justify-between">
                <Stepper>
                  <StepperButton
                    aria-label="Diminuer"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      setQuantity(item.recipeId, item.quantity - 1)
                    }
                  >
                    <MinusIcon />
                  </StepperButton>
                  <StepperValue>{item.quantity} pers.</StepperValue>
                  <StepperButton
                    aria-label="Augmenter"
                    onClick={() =>
                      setQuantity(item.recipeId, item.quantity + 1)
                    }
                  >
                    <PlusIcon />
                  </StepperButton>
                </Stepper>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Retirer du panier"
                  onClick={() => remove(item.recipeId)}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
