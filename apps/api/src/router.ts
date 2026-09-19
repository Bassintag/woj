import { orpc } from "./lib/orpc";
import { recipeRouter } from "./recipes/recipe.router";

export const router = orpc.router({
  recipes: recipeRouter,
});
