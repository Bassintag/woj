import { HeartIcon } from "@phosphor-icons/react";
import type { Recipe } from "@woj/contract";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { image } from "@/lib/image";

export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-square rounded-2xl" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const isFavorite = useFavoritesStore((state) =>
    state.ids.includes(recipe.id),
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square rounded-2xl bg-muted-bg">
        {recipe.imageUrl && (
          <img
            alt={recipe.title}
            src={image(recipe.imageUrl)}
            className="aspect-square w-full object-cover"
          />
        )}
        <Button
          size="sm"
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
          className="absolute top-2 right-2 px-2"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(recipe.id);
          }}
        >
          <HeartIcon weight={isFavorite ? "fill" : "regular"} />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-md text-fg">{recipe.title}</h3>
        {recipe.calories && (
          <p className="text-xs text-muted-fg">
            {recipe.calories.toFixed(0)} kcal
          </p>
        )}
      </div>
    </div>
  );
}
