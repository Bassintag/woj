import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { auth } from "./lib/auth";
import {
  IdParamsSchema,
  IdSchema,
  PatchSchema,
  TextSchema,
} from "./lib/shared";
import { UnitSchema } from "./unit.contract";

// Schemas

export const ConversionSchema = z.object({
  id: z.number(),
  factor: z.number(),
  unit: UnitSchema,
});

export const IngredientSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  calories: z.number(),
  defaultUnit: UnitSchema,
  conversions: z.array(ConversionSchema),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const CreateIngredientSchema = z.object({
  title: TextSchema(128),
  calories: z.number().int().nonnegative(),
  defaultUnitId: IdSchema,
  conversions: z.array(
    z.object({ unitId: IdSchema, factor: z.number().positive() }),
  ),
});

export type CreateIngredient = z.infer<typeof CreateIngredientSchema>;

export const UpdateIngredientSchema = CreateIngredientSchema.partial();

export type UpdateIngredient = z.infer<typeof UpdateIngredientSchema>;

// Contract

const list = oc
  .meta(
    openapi({
      method: "GET",
      path: "/",
      summary: "List ingredients",
      description: "Returns all ingredients. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .output(z.array(IngredientSchema));

const get = oc
  .meta(
    openapi({
      method: "GET",
      path: "/{id}",
      summary: "Get an ingredient",
      description: "Returns an ingredient. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(IngredientSchema);

const create = oc
  .meta(
    openapi({
      method: "POST",
      path: "/",
      summary: "Create an ingredient",
      description: "Creates and returns an ingredient.",
    }),
  )
  .input(CreateIngredientSchema)
  .output(IngredientSchema);

const update = oc
  .meta(
    openapi({
      method: "PATCH",
      path: "/{id}",
      summary: "Update an ingredient",
      description:
        "Updates only the provided fields of an ingredient and returns an ingredient.",
    }),
  )
  .input(PatchSchema(UpdateIngredientSchema))
  .output(IngredientSchema);

const remove = oc
  .meta(
    openapi({
      method: "DELETE",
      path: "/{id}",
      summary: "Delete an ingredient",
      description: "Permanently deletes an ingredient.",
    }),
  )
  .input(IdParamsSchema);

export const ingredientsContract = oc
  .meta(openapi({ prefix: "/ingredients", tags: ["Ingredients"] }))
  .router({
    list,
    get,
    create,
    update,
    remove,
  });
