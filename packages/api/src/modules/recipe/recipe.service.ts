import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { recipeSelect } from './recipe.const';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.recipe.findUniqueOrThrow({
      select: recipeSelect,
      where: { id },
    });
  }
}
