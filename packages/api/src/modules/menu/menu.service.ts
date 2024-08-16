import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { selectRecipe } from '../recipe/recipe.const';
import { CreateMenuDto } from './menu.dto';

export interface GetRandomRecipesParam {
  quantity: number;
  withTags?: string[];
  excludeIds?: string[];
}

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getRandomRecipes({
    withTags = [],
    excludeIds,
    quantity,
  }: GetRandomRecipesParam) {
    const where = {
      id: { notIn: excludeIds },
      tags:
        withTags.length > 0 ? { some: { id: { in: withTags } } } : undefined,
    } satisfies Prisma.RecipeWhereInput;
    const count = await this.prisma.recipe.count({ where });
    quantity = Math.min(count, quantity);
    const indices: number[] = [];
    for (let i = 0; i < quantity; i += 1) {
      let index = Math.floor(Math.random() * (count - i));
      let insertIndex = 0;
      for (const previousIndex of indices) {
        if (previousIndex > index + insertIndex) break;
        insertIndex += 1;
      }
      indices.splice(insertIndex, 0, index + insertIndex);
    }
    const ids = await Promise.all(
      indices.map((index) =>
        this.prisma.recipe.findFirstOrThrow({
          select: { id: true },
          where,
          orderBy: { id: 'asc' },
          skip: index,
          take: 1,
        }),
      ),
    );
    return this.prisma.recipe.findMany({
      select: selectRecipe,
      where: { id: { in: ids.map((i) => i.id) } },
    });
  }

  async createMenu({ quantity, tags, exclude }: CreateMenuDto) {
    const recipes = await this.getRandomRecipes({
      quantity,
      excludeIds: exclude,
      withTags: tags,
    });
    return { recipes };
  }
}
