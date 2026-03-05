import type z from "zod";
import type { createMenuSchema } from "../schemas";
import type { RecipeDto } from "./recipe";

export type MenuDto = { recipes: RecipeDto[] };

export type CreateMenuDto = z.infer<typeof createMenuSchema>;
