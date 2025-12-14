import type { Prisma } from "@prisma/client";

export const tagSelect = {
  id: true,
  name: true,
} satisfies Prisma.TagSelect;
