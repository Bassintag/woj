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
  nutritionalFacts: z
    .array(z.object({ id: z.string(), amount: z.number() }))
    .nullish(),
  familyAncestors: z.array(z.object({ name: z.string() })).nullish(),
  eatingHabitsCompatibility: z
    .object({
      porkless: z.boolean(),
      vegetarian: z.boolean(),
      vegan: z.boolean(),
    })
    .nullish(),
  seasons: z.array(z.string()).nullish(),
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
        unit: UnitSchema.nullish().catch(undefined),
        ingredient: RecipeIngredientSchema,
      }),
      z.object({
        unit: UnitSchema.nullish().catch(undefined),
        ingredient: RecipeIngredientSchema.extend({
          quantityPerCover: z.number(),
        }),
      }),
    ]),
  ),
});

export type Recipe = z.infer<typeof RecipeSchema>;
