import { pageableQuerySchema } from '@woj/common/schemas';
import { createZodDto } from 'nestjs-zod';

export class PageableQueryDto extends createZodDto(pageableQuerySchema) {}
