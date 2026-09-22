import type { BaseContext } from "../../context";
import { unitOptions } from "./unit.options";

export function createUnitContext(context: BaseContext) {
  return {
    queries: {
      list: context.db.query.units
        .findMany({ ...unitOptions, orderBy: { title: "asc" } })
        .prepare(),
    },
  };
}
