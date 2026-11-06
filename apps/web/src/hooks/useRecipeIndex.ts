import { useSuspenseQuery } from "@tanstack/react-query";
import type { Recipe } from "@woj/contract";
import MiniSearch from "minisearch";
import { useMemo } from "react";
import { q } from "@/lib/orpc";

export function useRecipeSearch() {
  const recipes = useSuspenseQuery(q.recipes.list.queryOptions());

  const { index, map } = useMemo(() => {
    const index = new MiniSearch({
      idField: "id",
      fields: ["title"],
      searchOptions: { fuzzy: 2 },
    });
    index.addAll(recipes.data);
    const map = new Map(recipes.data.map((recipe) => [recipe.id, recipe]));
    return { index, map };
  }, [recipes.data]);

  return {
    index,
    recipes: recipes.data,
    get(id: number) {
      return map.get(id) as Recipe;
    },
  };
}
