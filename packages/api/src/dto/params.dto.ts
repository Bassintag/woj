import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const idParamsSchema = z.object({
  id: z.coerce.number().min(1),
});

export class IdParamsDto extends createZodDto(idParamsSchema) {}
