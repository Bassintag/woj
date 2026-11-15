import { oc } from "@orpc/contract";

import { imagesContract } from "./image.contract";
import { ingredientsContract } from "./ingredient.contract";
import { menusContract } from "./menu.contract";
import { recipesContract } from "./recipe.contract";
import { tagsContract } from "./tag.contract";
import { tokenContract } from "./token.contract";
import { unitsContract } from "./unit.contract";

export { getAuthMeta } from "./lib/auth";
export { IdParamsSchema } from "./lib/shared";

// Contract

export * from "./image.contract";
export * from "./ingredient.contract";
export * from "./menu.contract";
export * from "./recipe.contract";
export * from "./tag.contract";
export * from "./token.contract";
export * from "./unit.contract";

export const contract = oc.router({
  images: imagesContract,
  ingredients: ingredientsContract,
  menus: menusContract,
  recipes: recipesContract,
  tags: tagsContract,
  tokens: tokenContract,
  units: unitsContract,
});
