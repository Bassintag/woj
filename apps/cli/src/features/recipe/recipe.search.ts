import type { RecipeListItem } from "@woj/contract";
import MiniSearch from "minisearch";

export function searchRecipes(recipes: RecipeListItem[], query: string) {
  const index = new MiniSearch<RecipeListItem>({
    idField: "id",
    fields: ["title", "ingredients"],
    extractField: (recipe, field) =>
      field === "ingredients"
        ? recipe.ingredients.join(" ")
        : recipe[field as "title"],
    searchOptions: { fuzzy: 2, boost: { title: 3 } },
  });
  index.addAll(recipes);
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  return index.search(query).map((result) => byId.get(result.id)!);
}
