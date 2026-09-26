import { int, real, snakeCase, uniqueIndex } from "drizzle-orm/sqlite-core";
import { ingredients } from "./ingredients";
import { units } from "./units";

export const conversions = snakeCase.table(
  "conversions",
  {
    id: int().primaryKey({ autoIncrement: true }),
    factor: real().notNull(),
    ingredientId: int()
      .notNull()
      .references(() => ingredients.id),
    unitId: int()
      .notNull()
      .references(() => units.id),
  },
  (table) => [
    uniqueIndex("ingredient_unit_idx").on(table.ingredientId, table.unitId),
  ],
);
