import type { QueryOptions } from "../../lib/db";
import { ingredientOptions } from "../ingredient/ingredient.options";
import { tagOptions } from "../tag/tag.options";

export const recipeOptions = {
  columns: {
    id: true,
    title: true,
    imageUrl: true,
    bakingTime: true,
    cookingTime: true,
    calories: true,
  },
  with: {
    tags: tagOptions,
  },
} satisfies QueryOptions<"recipes">;

export const recipeDetailsOptions = {
  ...recipeOptions,
  with: {
    ...recipeOptions.with,
    constituents: {
      columns: {
        id: true,
        quantity: true,
      },
      with: {
        ingredient: ingredientOptions,
      },
    },
    steps: {
      columns: {
        id: true,
        description: true,
      },
      orderBy: {
        order: "asc",
      },
    },
  },
} satisfies QueryOptions<"recipes">;
