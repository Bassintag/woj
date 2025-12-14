import type { Prisma } from "@prisma/client";
import type { ingredientSelect } from "../select";

export type IngredientDto = Prisma.IngredientGetPayload<{
  select: typeof ingredientSelect;
}>;
