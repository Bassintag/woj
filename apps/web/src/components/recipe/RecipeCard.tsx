import type { Recipe } from "@woj/contract";
import { image } from "@/lib/image";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-square rounded-2xl bg-muted-bg">
        {recipe.imageUrl && (
          <img
            alt={recipe.title}
            src={image(recipe.imageUrl)}
            className="aspect-square w-full object-cover"
          />
        )}
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
