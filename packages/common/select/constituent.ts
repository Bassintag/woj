import type { Prisma } from "@prisma/client";
import { unitSelect } from "./unit";
import { ingredientSelect } from "./ingredient";

export const constituentSelect = {
  id: true,
  quantity: true,
  ingredient: { select: ingredientSelect },
  unit: { select: unitSelect },
} satisfies Prisma.ConstituentSelect;
