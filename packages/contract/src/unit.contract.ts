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

export const UpdateUnitSchema = CreateUnitSchema.partial();

export type UpdateUnit = z.infer<typeof UpdateUnitSchema>;

// Contract

const list = oc
  .meta(
    openapi({
      method: "GET",
      path: "/",
      summary: "List units",
      description: "Returns all units. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .output(z.array(UnitSchema));

const get = oc
  .meta(
    openapi({
      method: "GET",
      path: "/{id}",
      summary: "Get an unit",
      description: "Returns a unit. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(UnitSchema);

const create = oc
  .meta(
    openapi({
      method: "POST",
      path: "/",
      summary: "Create an unit",
      description: "Creates and returns a unit.",
    }),
  )
  .input(CreateUnitSchema)
  .output(UnitSchema);

const update = oc
  .meta(
    openapi({
      method: "PATCH",
      path: "/{id}",
      summary: "Update an unit",
      description:
        "Updates only the provided fields of an unit and returns a unit.",
    }),
  )
  .input(PatchSchema(UpdateUnitSchema))
  .output(UnitSchema);

const remove = oc
  .meta(
    openapi({
      method: "DELETE",
      path: "/{id}",
      summary: "Delete an unit",
      description: "Permanently deletes an unit.",
    }),
  )
  .input(IdParamsSchema);

export const unitsContract = oc
  .meta(openapi({ prefix: "/units", tags: ["Units"] }))
  .router({
    list,
    get,
    create,
    update,
    remove,
  });
