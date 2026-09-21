import { int, real, snakeCase, uniqueIndex } from "drizzle-orm/sqlite-core";

export const constituents = snakeCase.table(
  "constituents",
  {
    id: int().primaryKey({ autoIncrement: true }),
    quantity: real(),
    recipeId: int(),
    indredientId: int(),
  },
  (table) => [
    uniqueIndex("recipe_ingredient_idx").on(table.recipeId, table.indredientId),
  ],
);
