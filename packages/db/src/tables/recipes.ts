import { int, snakeCase, text } from "drizzle-orm/sqlite-core";

export const recipes = snakeCase.table("recipes", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  imageUrl: text(),
  bakingTime: int(),
  cookingTime: int(),
  calories: int().notNull(),
});
