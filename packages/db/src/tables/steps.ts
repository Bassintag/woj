import { int, snakeCase, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { recipes } from "./recipes";

export const steps = snakeCase.table(
  "steps",
  {
    id: int().primaryKey({ autoIncrement: true }),
    order: int().notNull(),
    description: text().notNull(),
    recipeId: int()
      .notNull()
      .references(() => recipes.id),
  },
  (table) => [uniqueIndex("recipe_order_idx").on(table.recipeId, table.order)],
);
