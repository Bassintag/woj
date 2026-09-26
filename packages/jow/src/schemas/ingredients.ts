import { z } from "zod";
import { IngredientSchema } from "./ingredient";

export const IngredientsSchema = z.array(
  IngredientSchema.pick({
    id: true,
  }),
);
