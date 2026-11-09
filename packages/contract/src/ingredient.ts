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
import { UnitSchema } from "./unit";

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

export const UpdateIngredientSchema = PatchSchema(CreateIngredientSchema.shape);

export type UpdateIngredient = z.infer<typeof UpdateIngredientSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .meta(auth(false))
  .output(z.array(IngredientSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(IngredientSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(CreateIngredientSchema)
  .output(IngredientSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(UpdateIngredientSchema)
  .output(IngredientSchema);

const remove = oc
  .meta(openapi({ method: "DELETE", path: "/{id}" }))
  .input(IdParamsSchema);

export const ingredientsContract = oc
  .meta(openapi({ prefix: "/ingredients" }))
  .router({
    list,
    get,
    create,
    update,
    remove,
  });
