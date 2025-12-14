import type { Prisma } from "@prisma/client";

export const toolSelect = {
  id: true,
  name: true,
  imagePath: true,
  trivial: true,
} satisfies Prisma.ToolSelect;
