import type { Prisma } from "@prisma/client";
import type z from "zod";
import type { recipePageQuerySchema } from "../schemas";
import type { recipeDetailsSelect, recipeSelect } from "../select";

export type RecipeDto = Prisma.RecipeGetPayload<{
  select: typeof recipeSelect;
}>;

export type RecipeDetailsDto = Prisma.RecipeGetPayload<{
  select: typeof recipeDetailsSelect;
}>;

export type RecipePageQueryDto = z.infer<typeof recipePageQuerySchema>;
