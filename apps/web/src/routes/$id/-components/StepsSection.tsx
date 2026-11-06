import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { q } from "@/lib/orpc";

const Route = getRouteApi("/$id/");

export function StepsSection() {
  return (
    <section className="flex flex-col gap-6 px-layout">
      <h2 className="text-h2 text-fg">Préparation</h2>
      <Suspense>
        <StepSectionContent />
      </Suspense>
    </section>
  );
}

function StepSectionContent() {
  const id = Route.useParams({ select: (p) => p.id });
  const steps = useSuspenseQuery(
    q.recipes.get.queryOptions({
      input: { id },
      select: (recipe) => recipe.steps,
    }),
  );

  return (
    <ol className="flex flex-col gap-4">
      {steps.data.map((step, i) => (
        <li
          key={step.id}
          className="flex flex-col gap-2 rounded-2xl bg-muted-bg p-4"
        >
          <h3 className="text-xs text-muted-fg uppercase">étape {i + 1}</h3>
          <p className="text-md whitespace-pre-wrap text-fg">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
