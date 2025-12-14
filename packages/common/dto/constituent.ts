import type { Prisma } from "@prisma/client";
import type { constituentSelect } from "../select";

export type ConstituentDto = Prisma.ConstituentGetPayload<{
  select: typeof constituentSelect;
}>;
