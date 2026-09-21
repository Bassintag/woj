import type { QueryOptions } from "../lib/db";

export const recipeOptions = {
  columns: {
    id: true,
    title: true,
    imageUrl: true,
    calories: true,
  },
  with: {
    constituents: {
      columns: {
        quantity: true,
      },
      with: {
        ingredient: {
          columns: {
            id: true,
            title: true,
            imageUrl: true,
            calories: true,
          },
        },
      },
    },
  },
} satisfies QueryOptions<"recipes">;
