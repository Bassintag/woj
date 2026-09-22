import { orpc } from "../../lib/orpc";

const list = orpc.units.list.handler(({ context }) => {
  return context.unit.queries.list.execute();
});

export const unitRouter = orpc.units.router({
  list,
});
