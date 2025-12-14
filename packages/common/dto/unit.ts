import type { Prisma } from "@prisma/client";
import type { unitSelect } from "../select";

export type UnitDto = Prisma.UnitGetPayload<{
  select: typeof unitSelect;
}>;
