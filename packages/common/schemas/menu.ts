import z from "zod";

export const createMenuSchema = z.object({
  quantity: z.number().min(1).max(50),
  tags: z.array(z.number().min(1)).nullish(),
  exclude: z.array(z.number().min(1)).nullish(),
});
