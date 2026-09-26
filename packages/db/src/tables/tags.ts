import { int, snakeCase, text } from "drizzle-orm/sqlite-core";

export const tags = snakeCase.table("tags", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull().unique(),
  color: text().notNull(),
});
