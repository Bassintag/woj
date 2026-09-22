import { sql } from "drizzle-orm";
import type { BaseContext } from "../../context";
import { tagOptions } from "./tag.options";

export function createTagContext(context: BaseContext) {
  return {
    queries: {
      list: context.db.query.tags
        .findMany({ ...tagOptions, orderBy: { title: "asc" } })
        .prepare(),
      get: context.db.query.tags
        .findFirst({
          ...tagOptions,
          where: { id: sql.placeholder("id") },
        })
        .prepare(),
    },
  };
}
