import { createMenuSchema } from '@woj/common/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateMenuDto extends createZodDto(createMenuSchema) {}
