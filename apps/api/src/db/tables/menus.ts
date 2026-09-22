import { int, snakeCase, text } from "drizzle-orm/sqlite-core";

export const menus = snakeCase.table("menus", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
});
