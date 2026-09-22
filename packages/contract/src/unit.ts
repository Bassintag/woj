import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";

// Schemas

export const SymbolSchema = z.object({
  id: z.number(),
  title: z.string(),
  digits: z.number(),
  factor: z.number(),
  min: z.number().nullable(),
  max: z.number().nullable(),
});

export type Symbol = z.infer<typeof SymbolSchema>;

export const UnitSchema = z.object({
  id: z.number(),
  title: z.string(),
  symbols: z.array(SymbolSchema),
});

export type Unit = z.infer<typeof UnitSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(UnitSchema));

export const unitsContract = oc.meta(openapi({ prefix: "/units" })).router({
  list,
});
