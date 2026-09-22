import { sql } from "drizzle-orm";
import type { BaseContext } from "../../context";
import { ingredientOptions } from "./ingredient.options";

export function createIngredientContext(context: BaseContext) {
  return {
    queries: {
      list: context.db.query.ingredients
        .findMany({ ...ingredientOptions, orderBy: { id: "desc" } })
        .prepare(),
      get: context.db.query.ingredients
        .findFirst({
          ...ingredientOptions,
          where: { id: sql.placeholder("id") },
        })
        .prepare(),
    },
  };
}
