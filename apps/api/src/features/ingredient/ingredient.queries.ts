import { type Db, query } from "../../lib/db";
import { ingredientOptions } from "./ingredient.options";

export function createIngredientQueries(db: Db) {
  return {
    list: query(() =>
      db.query.ingredients.findMany({
        ...ingredientOptions,
        orderBy: { id: "desc" },
      }),
    ),
    get: query((p: { id: number }) =>
      db.query.ingredients.findFirst({
        ...ingredientOptions,
        where: { id: p.id },
      }),
    ),
  };
}
