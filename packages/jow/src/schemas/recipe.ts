import { z } from "zod";
import { AlternativeUnitSchema } from "./alternativeUnit";
import { UnitSchema } from "./unit";

export const RecipeIngredientSchema = z.object({
  id: z.string(),
  naturalUnit: UnitSchema.nullish(),
  alternativeUnits: z.array(AlternativeUnitSchema).nullish(),
});

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  preparationTime: z.int().nullish(),
  cookingTime: z.int().nullish(),
  directions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
  constituents: z.array(
    z.union([
      z.object({
        quantityPerCover: z.number(),
        ingredient: RecipeIngredientSchema,
      }),
      z.object({
        ingredient: RecipeIngredientSchema.extend({
          quantityPerCover: z.number(),
        }),
      }),
    ]),
  ),
});

export type Recipe = z.infer<typeof RecipeSchema>;
