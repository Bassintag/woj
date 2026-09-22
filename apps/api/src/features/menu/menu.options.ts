import type { QueryOptions } from "../../lib/db";
import { recipeOptions } from "../recipe/recipe.options";

export const menuOptions = {
  columns: {
    id: true,
    title: true,
  },
  with: {
    meals: {
      columns: {
        id: true,
        quantity: true,
      },
      with: {
        recipe: recipeOptions,
      },
      orderBy: {
        order: "asc",
      },
    },
  },
} satisfies QueryOptions<"menus">;
