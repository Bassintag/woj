import { int, snakeCase, text } from "drizzle-orm/sqlite-core";

export const ingredients = snakeCase.table("ingredients", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  imageUrl: text(),
  calories: int().notNull(),
});
