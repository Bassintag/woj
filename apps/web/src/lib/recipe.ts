import type { RecipeListItem } from "@woj/contract";
import MiniSearch from "minisearch";

export function createRecipeIndex(recipes: RecipeListItem[]) {
  const index = new MiniSearch<RecipeListItem>({
    idField: "id",
    fields: ["title", "ingredients"],
    extractField: (recipe, field) =>
      field === "ingredients"
        ? recipe.constituents.map((c) => c.ingredient.title).join(" ")
        : recipe[field as "title"],
    searchOptions: { fuzzy: 2, boost: { title: 3 } },
  });
  index.addAll(recipes);
  return index;
}

export function filterByTags<T extends { id: number }>(
  results: T[],
  tags: number[],
  get: (id: number) => { tags: { id: number }[] },
) {
  return results.filter((result) => {
    const recipe = get(result.id);
    return tags.some((id) => recipe.tags.some((tag) => tag.id === id));
  });
}
