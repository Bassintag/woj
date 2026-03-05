import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './menu.dto';
import { recipeSelect } from '@woj/common/select';

export interface GetRandomRecipesParam {
  quantity: number;
  withTags?: number[];
  excludeIds?: number[];
}

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getRandomRecipes({ tags = [], exclude = [], quantity }: CreateMenuDto) {
    const where = {
      id: { notIn: exclude },
      AND: tags.map((tagId) => ({
        tags: { some: { id: tagId } },
      })),
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
      select: recipeSelect,
      where: { id: { in: ids.map((i) => i.id) } },
    });
  }

  async createMenu(data: CreateMenuDto) {
    const recipes = await this.getRandomRecipes(data);
    return { recipes };
  }
}
