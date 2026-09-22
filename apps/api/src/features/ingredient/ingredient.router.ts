import { orThrow } from "../../lib/db";
import { orpc } from "../../lib/orpc";

const list = orpc.ingredients.list.handler(({ context }) => {
  return context.ingredient.queries.list.execute();
});

const get = orpc.ingredients.get.handler(({ context, input }) => {
  return orThrow(context.ingredient.queries.get.execute({ id: input.id }));
});

const create = orpc.ingredients.create.handler(() => {
  throw new Error("Not implemented");
});

const update = orpc.ingredients.update.handler(() => {
  throw new Error("Not implemented");
});

const remove = orpc.ingredients.remove.handler(() => {
  throw new Error("Not implemented");
});

export const ingredientRouter = orpc.ingredients.router({
  list,
  get,
  create,
  update,
  remove,
});
