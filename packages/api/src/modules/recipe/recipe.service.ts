import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { selectRecipe } from './recipe.const';
import { GetRecipePageQueryDto } from './recipe.dto';
import { Prisma } from '@prisma/client';
import { pageableToPrisma } from '../../utils/page.utils';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}

  getPage({ search, ...query }: GetRecipePageQueryDto) {
    const where = {
      OR: [
        { name: search ? { contains: search } : undefined },
        {
          ingredients: { some: { ingredient: { name: { contains: search } } } },
        },
      ],
    } satisfies Prisma.RecipeWhereInput;
    return this.prisma.$transaction([
      this.prisma.recipe.count({ where }),
      this.prisma.recipe.findMany({
        select: selectRecipe,
        where,
        ...pageableToPrisma(query),
        orderBy: { name: 'asc' },
      }),
    ]);
  }

  get(id: number) {
    return this.prisma.recipe.findUniqueOrThrow({
      select: selectRecipe,
      where: { id },
    });
  }
}
