import { sortBy } from "es-toolkit";
import { useMemo } from "react";
import { filterByTags } from "@/lib/recipe";
import { useRecipeSearch } from "./useRecipeIndex";

const orders = new Map<number, number>();

function randomOrder({ id }: { id: number }) {
  if (!orders.has(id)) orders.set(id, Math.random());
  return orders.get(id);
}

export function useRecipeResults({
  q,
  tags,
  ids,
}: {
  q?: string | null;
  tags?: number[];
  ids?: number[];
}) {
  const api = useRecipeSearch();
  const shuffled = useMemo(
    () => sortBy(api.recipes, [randomOrder]),
    [api.recipes],
  );
  let results: { id: number }[] = q ? api.index.search(q) : shuffled;
  if (ids) {
    results = results.filter((result) => ids.includes(result.id));
  }
  if (tags) {
    results = filterByTags(results, tags, api.get);
  }
  return { api, results };
}
