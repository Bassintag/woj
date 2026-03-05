import { RecipeService } from './recipe.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecipePageQueryDto } from './recipe.dto';
import { prismaToPage } from '../../utils/page.utils';
import { IdParamsDto } from 'src/dto/params.dto';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getPage(@Query() query: RecipePageQueryDto) {
    const result = await this.recipeService.getPage(query);
    return prismaToPage(query, result);
  }

  @Get(':id')
  get(@Param() { id }: IdParamsDto) {
    return this.recipeService.get(id);
  }
}
