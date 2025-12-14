import type { Prisma } from "@prisma/client";

export const stepSelect = {
  id: true,
  description: true,
} satisfies Prisma.StepSelect;
