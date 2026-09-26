import { z } from "zod";
import { UnitSchema } from "./unit";

export const RecipeIngredientSchema = z.object({
  id: z.string(),
  naturalUnit: UnitSchema.nullish(),
  naturalUnitInKg: z.number().nullish(),
  alternativeUnits: z
    .array(
      z.object({
        unit: UnitSchema,
        quantity: z.number(),
      }),
    )
    .nullish(),
});

export const RecipeSchema = z.object({
  id: z.string(),
  constituents: z.array(
    z.object({
      ingredient: RecipeIngredientSchema,
      alternatives: z.array(RecipeIngredientSchema).nullish(),
    }),
  ),
});
