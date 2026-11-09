import {
  MinusIcon,
  NotepadIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { range } from "es-toolkit";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper, StepperButton, StepperValue } from "@/components/ui/Stepper";
import { useCartStore } from "@/hooks/useCartStore";
import { useListStore } from "@/hooks/useListStore";
import { useRecipeSearch } from "@/hooks/useRecipeIndex";
import { image } from "@/lib/image";
import { q } from "@/lib/orpc";
import { buildShoppingList } from "@/lib/shoppingList";

function plural(count: number, word: string) {
  return `${count} ${word}${count > 1 ? "s" : ""}`;
}

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const portions = items.reduce((sum, item) => sum + item.quantity, 0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const submit = useMutation({
    async mutationFn() {
      const entries = await Promise.all(
        items.map(async (item) => ({
          recipe: await queryClient.query(
            q.recipes.get.queryOptions({ input: { id: item.recipeId } }),
          ),
          servings: item.quantity,
        })),
      );
      useListStore.getState().replace(buildShoppingList(entries));
      useCartStore.getState().clear();
      await navigate({ to: "/list" });
    },
  });

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
          <Suspense fallback={<CartLinesSkeleton count={items.length} />}>
            <CartLines />
          </Suspense>
        ) : (
          <p className="text-md text-muted-fg">Le panier est vide.</p>
        )}
      </div>
      <DrawerClose
        render={
          <Button
            variant="brand"
            className="shrink-0"
            disabled={!items.length || submit.isPending}
            onClick={() => submit.mutate()}
          />
        }
      >
        <NotepadIcon />
        Créer la liste de courses
      </DrawerClose>
    </DrawerContent>
  );
}

function CartLinesSkeleton({ count }: { count: number }) {
  return (
    <ul className="flex flex-col gap-4">
      {range(count).map((i) => (
        <li className="flex flex-row items-center gap-4" key={i}>
          <Skeleton className="size-18 shrink-0 rounded-2xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
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
            <div className="size-18 shrink-0 overflow-hidden rounded-2xl bg-muted-bg">
              {recipe.imageUrl && (
                <img
                  className="size-full object-cover"
                  alt=""
                  src={image(recipe.imageUrl)}
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h3 className="truncate text-md text-fg">{recipe.title}</h3>
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
