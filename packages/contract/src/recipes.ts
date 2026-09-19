import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";

// Schemas

export const RecipeSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  calories: z.number(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(RecipeSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .input(z.object({ id: z.int() }))
  .output(RecipeSchema);

export const recipesContract = oc.meta(openapi({ prefix: "/recipes" })).router({
  list,
  get,
});
