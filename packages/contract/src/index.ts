import { oc } from "@orpc/contract";
import { recipesContract } from "./recipes";

export * from "./recipes";

export const contract = oc.router({
  recipes: recipesContract,
});
