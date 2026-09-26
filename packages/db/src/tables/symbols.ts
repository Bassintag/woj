import {
  int,
  real,
  snakeCase,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { units } from "./units";

export const symbols = snakeCase.table(
  "symbols",
  {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    digits: int().notNull(),
    factor: real().notNull(),
    min: real(),
    max: real(),
    unitId: int()
      .notNull()
      .references(() => units.id),
  },
  (table) => [uniqueIndex("title_unit_idx").on(table.title, table.unitId)],
);
