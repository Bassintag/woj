import type { Menu } from "@woj/contract";
import { Skeleton } from "@/components/ui/Skeleton";
import { image } from "@/lib/image";

export function MenuCardSkeleton() {
  return (
    <div className="flex w-40 flex-col gap-2">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function MenuCard({ menu }: { menu: Menu }) {
  return (
    <div className="flex w-40 flex-col gap-2">
      <div className="grid aspect-square w-full grid-cols-2 gap-2 rounded-2xl bg-muted-bg p-2">
        {menu.meals.slice(0, 4).map((meal) => (
          <div key={meal.id}>
            {meal.recipe.imageUrl && (
              <img
                className="aspect-square w-full rounded-lg object-cover"
                alt={meal.recipe.title}
                src={image(meal.recipe.imageUrl)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-md text-fg">{menu.title}</h3>
        {menu.meals.length > 1 && (
          <p className="text-xs text-muted-fg">{menu.meals.length} recettes</p>
        )}
      </div>
    </div>
  );
}
