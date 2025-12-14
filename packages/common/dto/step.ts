import type { Prisma } from "@prisma/client";
import type { stepSelect } from "../select";

export type StepDto = Prisma.StepGetPayload<{
  select: typeof stepSelect;
}>;
