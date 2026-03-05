import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { recipeDetailsSelect, recipeSelect } from '@woj/common/select';
import { pageableToPrisma } from '../../utils/page.utils';
import { PrismaService } from '../prisma/prisma.service';
import { RecipePageQueryDto } from './recipe.dto';

@Injectable()
export class RecipeService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  getPage({ search, ...query }: RecipePageQueryDto) {
    const where = {
      name: { contains: search },
    } satisfies Prisma.RecipeWhereInput;
    return this.prisma.$transaction([
      this.prisma.recipe.count({ where }),
      this.prisma.recipe.findMany({
        select: recipeSelect,
        where,
        ...pageableToPrisma(query),
        orderBy: { name: 'asc' },
      }),
    ]);
  }

  get(id: number) {
    return this.prisma.recipe.findUniqueOrThrow({
      select: recipeDetailsSelect,
      where: { id },
    });
  }
}
