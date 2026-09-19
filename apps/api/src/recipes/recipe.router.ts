import { orpc } from "../lib/orpc";

const list = orpc.recipes.list.handler(() => {
  return [];
});

const get = orpc.recipes.get.handler(() => {
  throw new Error("Not implemented");
});

export const recipeRouter = orpc.recipes.router({ list, get });
