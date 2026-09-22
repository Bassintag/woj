import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
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

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(IngredientSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .input(z.object({ id: z.int() }))
  .output(IngredientSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(IngredientSchema.omit({ id: true }))
  .output(IngredientSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(IngredientSchema.omit({ id: true }))
  .output(IngredientSchema);

const remove = oc.meta(openapi({ method: "DELETE", path: "/{id}" }));

export const ingredientsContract = oc
  .meta(openapi({ prefix: "/ingredients" }))
  .router({
    list,
    get,
    create,
    update,
    remove,
  });
