import z from "zod";
import { RecipeSchema } from "./recipe";

export const RecipeGroupSchema = z.object({
  recipes: z.array(RecipeSchema.omit({ directions: true })),
});
