import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { IngredientSchema } from "./ingredient";
import { auth } from "./lib/auth";
import { TagSchema } from "./tag";
import { UnitSchema } from "./unit";

// Schemas

export const ConstituentSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  unit: UnitSchema,
  ingredient: IngredientSchema,
});

export type Constituent = z.infer<typeof ConstituentSchema>;

export const StepSchema = z.object({
  id: z.number(),
  description: z.string(),
});

export const RecipeSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  calories: z.number().nullable(),
  tags: z.array(TagSchema.pick({ id: true })),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipeListItemSchema = RecipeSchema.extend({
  constituents: z.array(
    z.object({ ingredient: IngredientSchema.pick({ title: true }) }),
  ),
});

export type RecipeListItem = z.infer<typeof RecipeListItemSchema>;

export const RecipeDetailSchema = RecipeSchema.extend({
  bakingTime: z.number().nullable(),
  cookingTime: z.number().nullable(),
  constituents: z.array(ConstituentSchema),
  steps: z.array(StepSchema),
  tags: z.array(TagSchema),
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
  .output(z.array(RecipeListItemSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .input(z.object({ id: z.coerce.number() }))
  .output(RecipeDetailSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .meta(auth(true))
  .input(CreateRecipeSchema)
  .output(RecipeDetailSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .meta(auth(true))
  .input(CreateRecipeSchema)
  .output(RecipeDetailSchema);

const remove = oc
  .meta(openapi({ method: "DELETE", path: "/{id}" }))
  .meta(auth(true))
  .input(z.object({ id: z.int() }));

export const recipesContract = oc.meta(openapi({ prefix: "/recipes" })).router({
  list,
  get,
  create,
  update,
  remove,
});
