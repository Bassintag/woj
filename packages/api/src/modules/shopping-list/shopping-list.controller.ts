import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { GetRecipePageQueryDto } from '../recipe/recipe.dto';
import { prismaToPage } from '../../utils/page.utils';
import {
  CreateShoppingListDto,
  CreateShoppingListItemDto,
  SetShoppingItemIndexDto,
  UpdateShoppingItemDto,
} from './shopping-list.dto';

@Controller('shopping-lists')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get()
  async getPage(@Query() query: GetRecipePageQueryDto) {
    const result = await this.shoppingListService.getPage(query);
    return prismaToPage(query, result);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.shoppingListService.get(id);
  }

  @Post()
  async create(@Body() body: CreateShoppingListDto) {
    return this.shoppingListService.create(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.shoppingListService.delete(id);
  }

  @Post(':id/items')
  async createItem(
    @Param('id') id: number,
    @Body() data: CreateShoppingListItemDto,
  ) {
    return this.shoppingListService.createItem(id, data);
  }

  @Patch(':id/items/:itemId')
  async updateItem(
    @Param('id') id: number,
    @Param('itemId') itemId: number,
    @Body() data: UpdateShoppingItemDto,
  ) {
    return this.shoppingListService.updateItem(id, itemId, data);
  }

  @Delete(':id/items/:itemId')
  async deleteItem(@Param('id') id: number, @Param('itemId') itemId: number) {
    return this.shoppingListService.deleteItem(id, itemId);
  }

  @Put(':id/items/:itemId/index')
  async setItemIndex(
    @Param('id') id: number,
    @Param('itemId') itemId: number,
    @Body() data: SetShoppingItemIndexDto,
  ) {
    return this.shoppingListService.setItemIndex(id, itemId, data);
  }
}
