import { int, snakeCase, uniqueIndex } from "drizzle-orm/sqlite-core";
import { menus } from "./menus";
import { recipes } from "./recipes";

export const meals = snakeCase.table(
  "meals",
  {
    id: int().primaryKey({ autoIncrement: true }),
    order: int().notNull(),
    quantity: int().notNull(),
    menuId: int()
      .notNull()
      .references(() => menus.id),
    recipeId: int()
      .notNull()
      .references(() => recipes.id),
  },
  (table) => [uniqueIndex("menu_recipe_idx").on(table.menuId, table.recipeId)],
);
