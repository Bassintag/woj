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
  async get(@Param('id') id: string) {
    return this.shoppingListService.get(id);
  }

  @Post()
  async create(@Body() body: CreateShoppingListDto) {
    return this.shoppingListService.create(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.shoppingListService.delete(id);
  }

  @Post(':id/items')
  async createItem(
    @Param('id') id: string,
    @Body() data: CreateShoppingListItemDto,
  ) {
    return this.shoppingListService.createItem(id, data);
  }

  @Patch(':id/items/:itemId')
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() data: UpdateShoppingItemDto,
  ) {
    return this.shoppingListService.updateItem(id, itemId, data);
  }

  @Delete(':id/items/:itemId')
  async deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.shoppingListService.deleteItem(id, itemId);
  }

  @Put(':id/items/:itemId/index')
  async setItemIndex(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() data: SetShoppingItemIndexDto,
  ) {
    return this.shoppingListService.setItemIndex(id, itemId, data);
  }
}
