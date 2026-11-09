import { type Db, query } from "../../lib/db";
import { recipeDetailsOptions, recipeListOptions } from "./recipe.options";

export function createRecipeQueries(db: Db) {
  return {
    list: query(() =>
      db.query.recipes.findMany({
        ...recipeListOptions,
        orderBy: { id: "desc" },
      }),
    ),
    get: query((p: { id: number }) =>
      db.query.recipes.findFirst({
        ...recipeDetailsOptions,
        where: { id: p.id },
      }),
    ),
  };
}
