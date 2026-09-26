import { int, snakeCase, text } from "drizzle-orm/sqlite-core";

export const units = snakeCase.table("units", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull().unique(),
});
