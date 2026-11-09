import { type Db, query } from "../../lib/db";
import { unitOptions } from "./unit.options";

export function createUnitQueries(db: Db) {
  return {
    list: query(() =>
      db.query.units.findMany({ ...unitOptions, orderBy: { title: "asc" } }),
    ),
    get: query((p: { id: number }) =>
      db.query.units.findFirst({ ...unitOptions, where: { id: p.id } }),
    ),
  };
}
