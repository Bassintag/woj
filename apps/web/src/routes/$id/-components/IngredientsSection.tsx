import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { range } from "es-toolkit";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Stepper, StepperButton, StepperValue } from "@/components/ui/Stepper";
import { useCartStore } from "@/hooks/useCartStore";
import { useServingsStore } from "@/hooks/useServingsStore";
import { image } from "@/lib/image";
import { q } from "@/lib/orpc";
import { formatQuantity } from "@/lib/quantity";

const Route = getRouteApi("/$id/");

export function IngredientsSections() {
  const id = Route.useParams({ select: (p) => p.id });
  const defaultServings = useServingsStore((state) => state.servings);
  const setServings = useServingsStore((state) => state.set);
  const cartQuantity = useCartStore(
    (state) => state.items.find((item) => item.recipeId === id)?.quantity,
  );
  const servings = cartQuantity ?? defaultServings;

  return (
    <section className="flex flex-col gap-6 px-layout">
      <div className="flex min-h-10 flex-row items-center justify-between">
        <h2 className="text-h2 text-fg">Ingrédients</h2>
        {cartQuantity === undefined && (
          <Stepper>
            <StepperButton
              aria-label="Diminuer"
              disabled={servings <= 1}
              onClick={() => setServings(servings - 1)}
            >
              <MinusIcon />
            </StepperButton>
            <StepperValue>{servings} pers.</StepperValue>
            <StepperButton
              aria-label="Augmenter"
              onClick={() => setServings(servings + 1)}
            >
              <PlusIcon />
            </StepperButton>
          </Stepper>
        )}
      </div>
      <Suspense fallback={<IngredientsSectionsContentSkeleton />}>
        <IngredientsSectionsContent servings={servings} />
      </Suspense>
    </section>
  );
}

function IngredientsSectionsContentSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {range(6).map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function IngredientsSectionsContent({ servings }: { servings: number }) {
  const id = Route.useParams({ select: (p) => p.id });
  const constituents = useSuspenseQuery(
    q.recipes.get.queryOptions({
      input: { id },
      select: (recipe) => recipe.constituents,
    }),
  );

  return (
    <ul className="grid grid-cols-3 items-stretch gap-4">
      {constituents.data.map((constituent) => (
        <li className="flex flex-col gap-2" key={constituent.id}>
          <div className="aspect-square rounded-2xl bg-muted-bg p-4">
            {constituent.ingredient.imageUrl && (
              <img
                className="aspect-square w-full rounded-xl"
                alt={constituent.ingredient.title}
                src={image(constituent.ingredient.imageUrl)}
              />
            )}
          </div>
          <div className="flex grow flex-col gap-1">
            <h3 className="line-clamp-2 text-xs text-muted-fg">
              {constituent.ingredient.title}
            </h3>
            <p className="mt-auto text-md text-fg">
              {formatQuantity(
                constituent.quantity * servings,
                constituent.unit,
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
