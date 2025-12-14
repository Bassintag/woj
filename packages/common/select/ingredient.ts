import type { Prisma } from "@prisma/client";
import { unitSelect } from "./unit";

export const ingredientSelect = {
  id: true,
  name: true,
  imagePath: true,
  defaultUnit: { select: unitSelect },
  conversions: {
    select: {
      id: true,
      factor: true,
      unit: { select: unitSelect },
    },
  },
} satisfies Prisma.IngredientSelect;
