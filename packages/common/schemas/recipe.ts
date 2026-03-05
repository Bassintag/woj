import z from "zod";
import { pageableQuerySchema } from "./page";

export const recipePageQuerySchema = pageableQuerySchema.extend({
  search: z.string().nullish(),
});
