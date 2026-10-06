import z from "zod";
import { RecipeGroupSchema } from "./recipeGroup";

export const RecipeGroupsSchema = z.array(RecipeGroupSchema);
