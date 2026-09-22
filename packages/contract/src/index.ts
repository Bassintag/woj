import { oc } from "@orpc/contract";

import { ingredientsContract } from "./ingredient";
import { menusContract } from "./menu";
import { recipesContract } from "./recipe";
import { tagsContract } from "./tag";
import { unitsContract } from "./unit";

export * from "./ingredient";
export * from "./menu";
export * from "./recipe";
export * from "./tag";
export * from "./unit";

export const contract = oc.router({
  ingredients: ingredientsContract,
  menus: menusContract,
  recipes: recipesContract,
  tags: tagsContract,
  units: unitsContract,
});
