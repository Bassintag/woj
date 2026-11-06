import type { QueryOptions } from "../../lib/db";
import { ingredientOptions } from "../ingredient/ingredient.options";
import { tagOptions } from "../tag/tag.options";

export const recipeOptions = {
  columns: {
    id: true,
    title: true,
    imageUrl: true,
    calories: true,
  },
  with: {
    tags: { columns: { id: true } },
  },
} satisfies QueryOptions<"recipes">;

export const recipeDetailsOptions = {
  columns: {
    ...recipeOptions.columns,
    bakingTime: true,
    cookingTime: true,
  },
  with: {
    tags: tagOptions,
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
