import { int, real, snakeCase, uniqueIndex } from "drizzle-orm/sqlite-core";
import { ingredients } from "./ingredients";
import { recipes } from "./recipes";

export const constituents = snakeCase.table(
  "constituents",
  {
    id: int().primaryKey({ autoIncrement: true }),
    quantity: real().notNull(),
    recipeId: int()
      .notNull()
      .references(() => recipes.id),
    indredientId: int()
      .notNull()
      .references(() => ingredients.id),
  },
  (table) => [
    uniqueIndex("recipe_ingredient_idx").on(table.recipeId, table.indredientId),
  ],
);
