import { z } from "zod";

export const IdSchema = z.number().int().positive();

export const IdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function TextSchema(length: number) {
  return z.string().trim().min(1).max(length);
}

export function PatchSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return IdParamsSchema.extend(schema.shape);
}
