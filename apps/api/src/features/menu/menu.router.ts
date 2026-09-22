import { orpc } from "../../lib/orpc";

const list = orpc.menus.list.handler(({ context }) => {
  return context.menu.queries.list.execute();
});

const create = orpc.menus.create.handler(() => {
  throw new Error("Not implemented");
});

const update = orpc.menus.update.handler(() => {
  throw new Error("Not implemented");
});

const remove = orpc.menus.remove.handler(() => {
  throw new Error("Not implemented");
});

export const menuRouter = orpc.menus.router({
  list,
  create,
  update,
  remove,
});
