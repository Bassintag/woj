import { type Db, query } from "../../lib/db";
import { menuOptions } from "./menu.options";

export function createMenuQueries(db: Db) {
  return {
    list: query(() =>
      db.query.menus.findMany({ ...menuOptions, orderBy: { id: "desc" } }),
    ),
    get: query((p: { id: number }) =>
      db.query.menus.findFirst({
        ...menuOptions,
        where: { id: p.id },
      }),
    ),
  };
}
