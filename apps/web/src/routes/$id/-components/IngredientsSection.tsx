import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { range } from "es-toolkit";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Stepper,
  StepperDecrement,
  StepperIncrement,
  StepperValue,
} from "@/components/ui/Stepper";
import { useServingsStore } from "@/hooks/useServingsStore";
import { image } from "@/lib/image";
import { q } from "@/lib/orpc";
import { formatQuantity } from "@/lib/quantity";

const Route = getRouteApi("/$id/");

export function IngredientsSections() {
  const store = useServingsStore();

  return (
    <section className="flex flex-col gap-6 px-layout">
      <div className="flex min-h-10 flex-row items-center justify-between">
        <h2 className="text-h2 text-fg">Ingrédients</h2>
        <Stepper
          value={store.servings}
          onValueChange={(value) => value != null && store.set(value)}
        >
          <StepperDecrement aria-label="Diminuer">
            <MinusIcon />
          </StepperDecrement>
          <StepperValue>{store.servings} pers.</StepperValue>
          <StepperIncrement aria-label="Augmenter">
            <PlusIcon />
          </StepperIncrement>
        </Stepper>
      </div>
      <Suspense fallback={<IngredientsSectionsContentSkeleton />}>
        <IngredientsSectionsContent />
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

function IngredientsSectionsContent() {
  const servings = useServingsStore((store) => store.servings);
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
          <div className="aspect-square rounded-2xl bg-surface p-4">
            {constituent.ingredient.imageUrl && (
              <img
                className="aspect-square w-full rounded-xl"
                alt={constituent.ingredient.title}
                src={image(constituent.ingredient.imageUrl)}
              />
            )}
          </div>
          <div className="flex grow flex-col gap-1">
            <h3 className="line-clamp-2 text-xs text-muted">
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
