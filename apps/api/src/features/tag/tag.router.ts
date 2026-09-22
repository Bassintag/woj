import { orThrow } from "../../lib/db";
import { orpc } from "../../lib/orpc";

const list = orpc.tags.list.handler(({ context }) => {
  return context.tag.queries.list.execute();
});

const get = orpc.tags.get.handler(({ context, input }) => {
  return orThrow(context.tag.queries.get.execute({ id: input.id }));
});

const create = orpc.tags.create.handler(() => {
  throw new Error("Not implemented");
});

const update = orpc.tags.update.handler(() => {
  throw new Error("Not implemented");
});

const remove = orpc.tags.remove.handler(() => {
  throw new Error("Not implemented");
});

export const tagRouter = orpc.tags.router({
  list,
  get,
  create,
  update,
  remove,
});
