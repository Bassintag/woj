import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { auth } from "./lib/auth";
import { IdParamsSchema, PatchSchema, TextSchema } from "./lib/shared";

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

export const CreateUnitSchema = z.object({
  title: TextSchema(64),
  symbols: z.array(
    SymbolSchema.omit({ id: true, title: true }).extend({
      title: TextSchema(16),
      digits: z.number().int().nonnegative(),
      factor: z.number().positive(),
      min: z.number().nullish(),
      max: z.number().nullish(),
    }),
  ),
});

export type CreateUnit = z.infer<typeof CreateUnitSchema>;

export const UpdateUnitSchema = PatchSchema(CreateUnitSchema.shape);

export type UpdateUnit = z.infer<typeof UpdateUnitSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .meta(auth(false))
  .output(z.array(UnitSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(UnitSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(CreateUnitSchema)
  .output(UnitSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(UpdateUnitSchema)
  .output(UnitSchema);

const remove = oc
  .meta(openapi({ method: "DELETE", path: "/{id}" }))
  .input(IdParamsSchema);

export const unitsContract = oc.meta(openapi({ prefix: "/units" })).router({
  list,
  get,
  create,
  update,
  remove,
});
