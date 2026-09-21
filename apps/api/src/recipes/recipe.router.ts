import { orThrow } from "../lib/db";
import { orpc } from "../lib/orpc";

const list = orpc.recipes.list.handler(({ context }) => {
  return context.recipe.queries.list.execute();
});

const get = orpc.recipes.get.handler(({ context, input }) => {
  return orThrow(context.recipe.queries.get.execute({ id: input.id }));
});

export const recipeRouter = orpc.recipes.router({ list, get });
