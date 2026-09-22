import { int, primaryKey, snakeCase } from "drizzle-orm/sqlite-core";
import { recipes } from "./recipes";
import { tags } from "./tags";

export const recipesToTags = snakeCase.table(
  "recipesToTags",
  {
    recipeId: int()
      .notNull()
      .references(() => recipes.id),
    tagId: int()
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.tagId] })],
);
