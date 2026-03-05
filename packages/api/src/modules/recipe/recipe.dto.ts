import { recipePageQuerySchema } from '@woj/common/schemas';
import { createZodDto } from 'nestjs-zod';

export class RecipePageQueryDto extends createZodDto(recipePageQuerySchema) {}
