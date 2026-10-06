import z from "zod";
import { UnitSchema } from "./unit";

export const AlternativeUnitSchema = z.object({
  id: z.string().optional(),
  unit: UnitSchema,
  quantity: z.number(),
});

export type AlternativeUnit = z.infer<typeof AlternativeUnitSchema>;
