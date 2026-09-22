import type { BaseContext } from "../../context";
import { menuOptions } from "./menu.options";

export function createMenuContext(context: BaseContext) {
  return {
    queries: {
      list: context.db.query.menus
        .findMany({ ...menuOptions, orderBy: { id: "desc" } })
        .prepare(),
    },
  };
}
