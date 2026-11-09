import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { auth } from "./lib/auth";
import { IdParamsSchema, PatchSchema, TextSchema } from "./lib/shared";

// Schemas

export const TagSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

export const CreateTagSchema = z.object({
  title: TextSchema(64),
});

export type CreateTag = z.infer<typeof CreateTagSchema>;

export const UpdateTagSchema = PatchSchema(CreateTagSchema.shape);

export type UpdateTag = z.infer<typeof UpdateTagSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .meta(auth(false))
  .output(z.array(TagSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(TagSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(CreateTagSchema)
  .output(TagSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(UpdateTagSchema)
  .output(TagSchema);

const remove = oc
  .meta(openapi({ method: "DELETE", path: "/{id}" }))
  .input(IdParamsSchema);

export const tagsContract = oc.meta(openapi({ prefix: "/tags" })).router({
  list,
  get,
  create,
  update,
  remove,
});
