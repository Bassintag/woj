import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";

// Schemas

export const UnitSchema = z.object({
  id: z.number(),
  defaultUnit: z.string(),
});

export type Unit = z.infer<typeof UnitSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(UnitSchema));

export const unitsContract = oc.meta(openapi({ prefix: "/units" })).router({
  list,
});
