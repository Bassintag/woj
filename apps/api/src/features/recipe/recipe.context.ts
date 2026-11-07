import { sql } from "drizzle-orm";
import type { BaseContext } from "../../context";
import { recipeDetailsOptions, recipeListOptions } from "./recipe.options";

export function createRecipeContext(context: BaseContext) {
  return {
    queries: {
      list: context.db.query.recipes
        .findMany({ ...recipeListOptions, orderBy: { id: "desc" } })
        .prepare(),
      get: context.db.query.recipes
        .findFirst({
          ...recipeDetailsOptions,
          where: { id: sql.placeholder("id") },
        })
        .prepare(),
    },
  };
}
