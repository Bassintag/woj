import { RecipeService } from './recipe.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.recipeService.get(id);
  }
}
