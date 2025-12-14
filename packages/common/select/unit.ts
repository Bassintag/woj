import type { Prisma } from "@prisma/client";

export const unitSelect = {
  id: true,
  name: true,
  symbols: {
    select: {
      id: true,
      name: true,
      factor: true,
      digits: true,
      min: true,
      max: true,
    },
  },
} satisfies Prisma.UnitSelect;
