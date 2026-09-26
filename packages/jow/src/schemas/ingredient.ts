import { z } from "zod";
import { RecipeSchema } from "./recipe";
import { UnitSchema } from "./unit";

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullish(),
  editorialData: z.object({
    nutritionalFacts: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        unit: z.string(),
        amount: z.number(),
      }),
    ),
  }),
  eatingHabitsCompatibility: z.object({
    porkless: z.boolean(),
    fish: z.boolean(),
    vegetarian: z.boolean(),
    vegan: z.boolean(),
    glutenFree: z.boolean(),
    dairyFree: z.boolean(),
    redMeat: z.boolean(),
    whiteMeat: z.boolean(),
  }),
  naturalUnit: UnitSchema,
  displayableUnits: z.array(
    z.object({
      unit: UnitSchema,
    }),
  ),
  recipes: z.array(RecipeSchema),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
