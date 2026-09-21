import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { IngredientSchema } from "./ingredients";
import { TagSchema } from "./tags";

// Schemas

export const RecipeSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  tags: z.array(TagSchema),
  cookingTime: z.number(),
  calories: z.number(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipeDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  tags: z.array(TagSchema),
  cookingTime: z.number(),
  bakingTime: z.number(),
  calories: z.number(),
  constituants: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      ingredient: IngredientSchema,
    }),
  ),
  steps: z.array(z.string()),
});

export type RecipeDetail = z.infer<typeof RecipeDetailSchema>;

export const CreateRecipeSchema = RecipeDetailSchema.omit({
  id: true,
  calories: true,
});

export type CreateRecipe = z.infer<typeof CreateRecipeSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(RecipeSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .input(z.object({ id: z.int() }))
  .output(RecipeDetailSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(CreateRecipeSchema)
  .output(RecipeDetailSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(CreateRecipeSchema)
  .output(RecipeDetailSchema);

const remove = oc.meta(openapi({ method: "DELETE", path: "/{id}" }));

export const recipesContract = oc.meta(openapi({ prefix: "/recipes" })).router({
  list,
  get,
  create,
  update,
  remove,
});
