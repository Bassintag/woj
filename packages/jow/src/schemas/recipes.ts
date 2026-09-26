import { z } from "zod";
import { RecipeSchema } from "./recipe";

export const RecipesSchema = z.array(RecipeSchema);
