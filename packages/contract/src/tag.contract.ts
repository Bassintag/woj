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

export const UpdateTagSchema = CreateTagSchema.partial();

export type UpdateTag = z.infer<typeof UpdateTagSchema>;

// Contract

const list = oc
  .meta(
    openapi({
      method: "GET",
      path: "/",
      summary: "List tags",
      description: "Returns all tags. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .output(z.array(TagSchema));

const get = oc
  .meta(
    openapi({
      method: "GET",
      path: "/{id}",
      summary: "Get a tag",
      description: "Returns a tag. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(TagSchema);

const create = oc
  .meta(
    openapi({
      method: "POST",
      path: "/",
      summary: "Create a tag",
      description: "Creates and returns a tag.",
    }),
  )
  .input(CreateTagSchema)
  .output(TagSchema);

const update = oc
  .meta(
    openapi({
      method: "PATCH",
      path: "/{id}",
      summary: "Update a tag",
      description:
        "Updates only the provided fields of a tag and returns a tag.",
    }),
  )
  .input(PatchSchema(UpdateTagSchema))
  .output(TagSchema);

const remove = oc
  .meta(
    openapi({
      method: "DELETE",
      path: "/{id}",
      summary: "Delete a tag",
      description: "Permanently deletes a tag.",
    }),
  )
  .input(IdParamsSchema);

export const tagsContract = oc
  .meta(openapi({ prefix: "/tags", tags: ["Tags"] }))
  .router({
    list,
    get,
    create,
    update,
    remove,
  });
