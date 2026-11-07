import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Stepper, StepperButton, StepperValue } from "@/components/ui/Stepper";
import { image } from "@/lib/image";
import { q } from "@/lib/orpc";
import { formatQuantity } from "@/lib/quantity";

const Route = getRouteApi("/$id/");

export function IngredientsSections() {
  const [servings, setServings] = useState(2);

  return (
    <section className="flex flex-col gap-6 px-layout">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-h2 text-fg">Ingrédients</h2>
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
      </div>
      <Suspense>
        <IngredientsSectionsContent servings={servings} />
      </Suspense>
    </section>
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
    <ul className="grid grid-cols-3 gap-4">
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
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-2 text-xs text-muted-fg">
              {constituent.ingredient.title}
            </h3>
            <p className="text-md text-fg">
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
