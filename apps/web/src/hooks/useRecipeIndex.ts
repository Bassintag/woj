import { useSuspenseQuery } from "@tanstack/react-query";
import type { RecipeListItem } from "@woj/contract";
import { useMemo } from "react";
import { q } from "@/lib/orpc";
import { createRecipeIndex } from "@/lib/recipe";

export function useRecipeSearch() {
  const recipes = useSuspenseQuery(q.recipes.list.queryOptions());

  const { index, map } = useMemo(() => {
    const index = createRecipeIndex(recipes.data);
    const map = new Map(recipes.data.map((recipe) => [recipe.id, recipe]));
    return { index, map };
  }, [recipes.data]);

  return {
    index,
    recipes: recipes.data,
    get(id: number) {
      return map.get(id) as RecipeListItem;
    },
  };
}
