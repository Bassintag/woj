import { sql } from "drizzle-orm";
import type { BaseContext } from "../context";
import { recipeOptions } from "./recipe.options";

export function createRecipeContext(context: BaseContext) {
  return {
    queries: {
      list: context.db.query.recipes
        .findMany({ ...recipeOptions, orderBy: { id: "desc" } })
        .prepare(),
      get: context.db.query.recipes
        .findFirst({ ...recipeOptions, where: { id: sql.placeholder("id") } })
        .prepare(),
    },
  };
}
