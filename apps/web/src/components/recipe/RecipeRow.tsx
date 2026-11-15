import { Link } from "@tanstack/react-router";
import type { RecipeListItem } from "@woj/contract";
import type { ReactNode } from "react";
import { image } from "@/lib/image";

type RecipeRowRecipe = Pick<
  RecipeListItem,
  "id" | "title" | "imageUrl" | "calories"
>;

function RecipeRowLink({
  id,
  link,
  className,
  children,
}: {
  id: number;
  link?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return link ? (
    <Link className={className} to="/$id" params={{ id }}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function RecipeRow({
  recipe,
  link,
  children,
}: {
  recipe: RecipeRowRecipe;
  link?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      <RecipeRowLink
        id={recipe.id}
        link={link}
        className="size-27 shrink-0 overflow-hidden rounded-2xl bg-surface"
      >
        {recipe.imageUrl && (
          <img
            className="size-full object-cover"
            alt={recipe.title}
            src={image(recipe.imageUrl)}
          />
        )}
      </RecipeRowLink>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <RecipeRowLink id={recipe.id} link={link} className="text-md text-fg">
          {recipe.title}
        </RecipeRowLink>
        {recipe.calories != null && (
          <p className="text-sm text-muted">
            {recipe.calories.toFixed(0)} kcal
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
