import { type Db, query } from "../../lib/db";
import { tagOptions } from "./tag.options";

export function createTagQueries(db: Db) {
  return {
    list: query(() =>
      db.query.tags.findMany({ ...tagOptions, orderBy: { title: "asc" } }),
    ),
    get: query((p: { id: number }) =>
      db.query.tags.findFirst({ ...tagOptions, where: { id: p.id } }),
    ),
  };
}
