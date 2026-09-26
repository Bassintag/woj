import { z } from "zod";

export const AbbreviationSchema = z.object({
  id: z.string(),
  label: z.string(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  digits: z.number(),
  divisor: z.number(),
  inverse: z.boolean(),
});

export type Abbreviation = z.infer<typeof AbbreviationSchema>;
