import type { Prisma } from "@prisma/client";
import type { recipeSelect } from "../select";

export type RecipeDto = Prisma.RecipeGetPayload<{
  select: typeof recipeSelect;
}>;
