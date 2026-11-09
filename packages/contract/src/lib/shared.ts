import { z } from "zod";

export const IdSchema = z.number().int().positive();

export const IdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function TextSchema(length: number) {
  return z.string().trim().min(1).max(length);
}

export function PatchSchema<T extends z.ZodRawShape>(shape: T) {
  return IdParamsSchema.extend(z.object(shape).partial().shape).refine(
    (input: Record<string, unknown>) =>
      Object.entries(input).some(([k, v]) => k !== "id" && v !== undefined),
    { message: "At least one field is required" },
  );
}
