import { imageRouter } from "./features/image/image.router";
import { ingredientRouter } from "./features/ingredient/ingredient.router";
import { menuRouter } from "./features/menu/menu.router";
import { recipeRouter } from "./features/recipe/recipe.router";
import { tagRouter } from "./features/tag/tag.router";
import { unitRouter } from "./features/unit/unit.router";
import { orpc } from "./lib/orpc";

export const router = orpc.router({
  images: imageRouter,
  ingredients: ingredientRouter,
  menus: menuRouter,
  recipes: recipeRouter,
  tags: tagRouter,
  units: unitRouter,
});
