import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { IngredientSchema } from "./ingredient.contract";
import { auth } from "./lib/auth";
import {
  IdParamsSchema,
  IdSchema,
  PatchSchema,
  TextSchema,
} from "./lib/shared";
import { TagSchema } from "./tag.contract";
import { UnitSchema } from "./unit.contract";

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
  tagIds: z.array(TagSchema.shape.id),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipeListItemSchema = RecipeSchema.extend({
  ingredients: z.array(IngredientSchema.shape.title),
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

export const CreateRecipeSchema = z.object({
  title: TextSchema(128),
  calories: z.number().nonnegative().nullish(),
  bakingTime: z.number().int().nonnegative().nullish(),
  cookingTime: z.number().int().nonnegative().nullish(),
  constituents: z.array(
    z.object({
      ingredientId: IdSchema,
      unitId: IdSchema,
      quantity: z.number().positive(),
    }),
  ),
  steps: z.array(z.object({ description: TextSchema(2048) })),
  tagIds: z.array(IdSchema),
});

export type CreateRecipe = z.infer<typeof CreateRecipeSchema>;

export const UpdateRecipeSchema = CreateRecipeSchema.partial();

export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .meta(auth(false))
  .output(z.array(RecipeListItemSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(RecipeDetailSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(CreateRecipeSchema)
  .output(RecipeDetailSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(PatchSchema(UpdateRecipeSchema))
  .output(RecipeDetailSchema);

const remove = oc
  .meta(openapi({ method: "DELETE", path: "/{id}" }))
  .input(IdParamsSchema);

export const recipesContract = oc.meta(openapi({ prefix: "/recipes" })).router({
  list,
  get,
  create,
  update,
  remove,
});
