import { z } from "zod";

export const pageableQuerySchema = z.object({
  size: z.coerce.number().min(1).max(50).default(20),
  page: z.coerce.number().min(0).default(0),
});
