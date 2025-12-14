import type { Prisma } from "@prisma/client";
import type { toolSelect } from "../select";

export type ToolDto = Prisma.ToolGetPayload<{ select: typeof toolSelect }>;
