import {
  FireIcon,
  HeartIcon,
  OvenIcon,
  PencilSimpleIcon,
  TimerIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { range } from "es-toolkit";
import { type ReactNode, Suspense } from "react";
import { AuthGate } from "@/components/auth/AuthGate";
import { Button } from "@/components/ui/Button";
import { DrawerTrigger } from "@/components/ui/Drawer";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { image } from "@/lib/image";
import { q } from "@/lib/orpc";
import { pageTitle } from "@/lib/pageTitle";
import { UpdateRecipeFormDrawer } from "@/routes/-components/RecipeFormDrawer";

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
  const isFavorite = useFavoritesStore((state) => state.ids.includes(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  return (
    <section className="flex flex-col gap-6 px-layout">
      <title>{pageTitle(recipe.data.title)}</title>
      <div className="relative h-64 shrink-0 rounded-4xl bg-surface">
        {recipe.data.imageUrl && (
          <img
            className="mx-auto aspect-square h-full object-cover object-center"
            alt={recipe.data.title}
            src={image(recipe.data.imageUrl)}
          />
        )}
        <Button
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
          className="absolute top-4 right-4"
          onClick={() => toggleFavorite(id)}
        >
          <HeartIcon weight={isFavorite ? "fill" : "regular"} />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-fg">{recipe.data.title}</h1>
        <AuthGate>
          <UpdateRecipeFormDrawer recipe={recipe.data}>
            <DrawerTrigger
              render={<Button size="sm" aria-label="Modifier la recette" />}
            >
              <PencilSimpleIcon />
            </DrawerTrigger>
          </UpdateRecipeFormDrawer>
        </AuthGate>
      </div>
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
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-3 text-fg *:[svg]:size-6">
      {icon}
      <div className="flex flex-col">
        <h3 className="text-md font-bold">{title}</h3>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </div>
  );
}
