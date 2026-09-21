import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";

// Schemas

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(TagSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .output(z.array(TagSchema));

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(TagSchema.omit({ id: true }))
  .output(TagSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(TagSchema.omit({ id: true }))
  .output(TagSchema);

const remove = oc.meta(openapi({ method: "DELETE", path: "/{id}" }));

export const tagsContract = oc.meta(openapi({ prefix: "/tags" })).router({
  list,
  get,
  create,
  update,
  remove,
});
