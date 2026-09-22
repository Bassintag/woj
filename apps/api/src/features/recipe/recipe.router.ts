import { orThrow } from "../../lib/db";
import { orpc } from "../../lib/orpc";

const list = orpc.recipes.list.handler(({ context }) => {
  return context.recipe.queries.list.execute();
});

const get = orpc.recipes.get.handler(({ context, input }) => {
  return orThrow(context.recipe.queries.get.execute({ id: input.id }));
});

const create = orpc.recipes.create.handler(() => {
  throw new Error("Not implemented");
});

const update = orpc.recipes.update.handler(() => {
  throw new Error("Not implemented");
});

const remove = orpc.recipes.remove.handler(() => {
  throw new Error("Not implemented");
});

export const recipeRouter = orpc.recipes.router({
  list,
  get,
  create,
  update,
  remove,
});
