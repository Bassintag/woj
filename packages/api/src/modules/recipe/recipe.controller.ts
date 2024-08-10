import { RecipeService } from './recipe.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetRecipePageQueryDto } from './recipe.dto';
import { prismaToPage } from '../../utils/page.utils';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getPage(@Query() query: GetRecipePageQueryDto) {
    const result = await this.recipeService.getPage(query);
    return prismaToPage(query, result);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.recipeService.get(id);
  }
}
