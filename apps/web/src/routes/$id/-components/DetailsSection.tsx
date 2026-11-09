import { FireIcon, OvenIcon, TimerIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { range } from "es-toolkit";
import { type ReactNode, Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { image } from "@/lib/image";
import { q } from "@/lib/orpc";

const Route = getRouteApi("/$id/");

export function DetailsSection() {
  return (
    <Suspense fallback={<DetailsSectionSkeleton />}>
      <DetailsSectionContent />
    </Suspense>
  );
}

function DetailsSectionSkeleton() {
  return (
    <section className="flex flex-col gap-6 px-layout">
      <Skeleton className="aspect-square w-full rounded-4xl" />
      <Skeleton className="h-8 w-3/4" />
      <div className="grid grid-cols-3 gap-4">
        {range(3).map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

export function DetailsSectionContent() {
  const id = Route.useParams({ select: (p) => p.id });
  const recipe = useSuspenseQuery(
    q.recipes.get.queryOptions({ input: { id } }),
  );

  return (
    <section className="flex flex-col gap-6 px-layout">
      <title>{`${recipe.data.title} · WOJ`}</title>
      <div className="rounded-4xl bg-muted-bg">
        {recipe.data.imageUrl && (
          <img
            className="aspect-square w-full object-cover object-center"
            alt={recipe.data.title}
            src={image(recipe.data.imageUrl)}
          />
        )}
      </div>
      <h1 className="text-h2 text-fg">{recipe.data.title}</h1>
      <div className="grid grid-cols-3 gap-4">
        {recipe.data.calories != null && (
          <DetailsCard
            icon={<FireIcon />}
            title={`${recipe.data.calories.toFixed(0)} kcal`}
            description="par portion"
          />
        )}
        {recipe.data.cookingTime != null && (
          <DetailsCard
            icon={<TimerIcon />}
            title={`${recipe.data.cookingTime} min`}
            description="préparation"
          />
        )}
        {recipe.data.bakingTime != null && (
          <DetailsCard
            icon={<OvenIcon />}
            title={`${recipe.data.bakingTime} min`}
            description="cuisson"
          />
        )}
      </div>
    </section>
  );
}

export function DetailsCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-muted-bg p-3 text-fg *:[svg]:size-6">
      {icon}
      <div className="flex flex-col">
        <h3 className="text-md font-bold">{title}</h3>
        <p className="text-xs text-muted-fg">{description}</p>
      </div>
    </div>
  );
}
