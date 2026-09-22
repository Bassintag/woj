import type { QueryOptions } from "../../lib/db";
import { unitOptions } from "../unit/unit.options";

export const ingredientOptions = {
  columns: {
    id: true,
    title: true,
    imageUrl: true,
    calories: true,
  },
  with: {
    defaultUnit: unitOptions,
    conversions: {
      columns: {
        id: true,
        factor: true,
      },
      with: {
        unit: unitOptions,
      },
    },
  },
} satisfies QueryOptions<"ingredients">;
