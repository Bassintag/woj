import type { Menu } from "@woj/contract";
import { image } from "@/lib/image";

export function MenuHero({ menu }: { menu: Menu }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-64 items-center justify-center rounded-4xl bg-muted-bg">
        <div className="grid aspect-square h-full grid-cols-2 gap-2 p-2">
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
      </div>
      <h1 className="text-h1 text-fg">{menu.title}</h1>
    </div>
  );
}
