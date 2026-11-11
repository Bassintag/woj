import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { IdParamsSchema } from "./lib/shared";

// Schemas

export const ImageKindSchema = z.enum(["ingredients", "recipes"]);

export type ImageKind = z.infer<typeof ImageKindSchema>;

export const UploadImageSchema = IdParamsSchema.extend({
  kind: ImageKindSchema,
  file: z.file().mime(["image/jpeg", "image/png", "image/webp"]),
});

export type UploadImage = z.infer<typeof UploadImageSchema>;

export const ImageSchema = z.object({ imageUrl: z.string() });

// Contract

const upload = oc
  .meta(openapi({ method: "PUT", path: "/{kind}/{id}" }))
  .input(UploadImageSchema)
  .output(ImageSchema);

export const imagesContract = oc.meta(openapi({ prefix: "/images" })).router({
  upload,
});
