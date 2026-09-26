import { z } from "zod";
import { AbbreviationSchema } from "./abbreviation";

export const UnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  abbreviations: z.array(AbbreviationSchema),
});

export type Unit = z.infer<typeof UnitSchema>;
