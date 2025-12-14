import type { Prisma } from "@prisma/client";
import type { tagSelect } from "../select";

export type TagDto = Prisma.TagGetPayload<{
  select: typeof tagSelect;
}>;
