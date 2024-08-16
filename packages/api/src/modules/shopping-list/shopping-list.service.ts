import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateShoppingListDto,
  CreateShoppingListItemDto,
  GetShoppingListPageQueryDto,
  SetShoppingItemIndexDto,
  UpdateShoppingItemDto,
} from './shopping-list.dto';
import { pageableToPrisma } from '../../utils/page.utils';
import { selectShoppingItem, selectShoppingList } from './shopping-list.const';
import { formatWithUnit } from '../../utils/unit.utils';

@Injectable()
export class ShoppingListService {
  constructor(private readonly prisma: PrismaService) {}

  getPage(query: GetShoppingListPageQueryDto) {
    return Promise.all([
      this.prisma.shoppingList.count(),
      this.prisma.shoppingList.findMany({
        select: selectShoppingList,
        orderBy: { createdAt: 'desc' },
        ...pageableToPrisma(query),
      }),
    ]);
  }

  get(id: string) {
    return this.prisma.shoppingList.findUniqueOrThrow({
      select: selectShoppingList,
      where: { id },
    });
  }

  create(data: CreateShoppingListDto) {
    return this.prisma.$transaction(async (em) => {
      const items = await em.recipeIngredient.findMany({
        select: {
          quantity: true,
          recipeId: true,
          ingredient: {
            select: {
              id: true,
              name: true,
              unit: {
                select: {
                  symbols: {
                    select: {
                      name: true,
                      min: true,
                      max: true,
                      digits: true,
                      factor: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: { recipeId: { in: data.recipes.map((recipe) => recipe.id) } },
      });
      const totals: Record<string, (typeof items)[number]> = {};
      for (const item of items) {
        const dataItem = data.recipes.find((r) => r.id === item.recipeId);
        if (dataItem == null) continue;
        const quantity = item.quantity * dataItem.quantity;
        if (item.ingredient.id in totals) {
          totals[item.ingredient.id].quantity += quantity;
        } else {
          totals[item.ingredient.id] = { ...item, quantity };
        }
      }
      return em.shoppingList.create({
        select: selectShoppingList,
        data: {
          items: {
            createMany: {
              data: Object.values(totals)
                .sort((a, b) =>
                  a.ingredient.name.localeCompare(b.ingredient.name),
                )
                .map((item, i) => ({
                  name: `${formatWithUnit(item.ingredient.unit, item.quantity)} ${item.ingredient.name}`,
                  ingredientId: item.ingredient.id,
                  order: i,
                })),
            },
          },
          recipes: {
            connect: data.recipes.map((r) => ({
              id: r.id,
            })),
          },
        },
      });
    });
  }

  delete(id: string) {
    return this.prisma.shoppingList.deleteMany({
      where: { id },
    });
  }

  createItem(id: string, data: CreateShoppingListItemDto) {
    return this.prisma.$transaction(async (em) => {
      const total = await em.shoppingItem.count({
        where: { shoppingListId: id },
      });
      return em.shoppingItem.create({
        data: { ...data, shoppingListId: id, order: total },
      });
    });
  }

  updateItem(id: string, itemId: string, data: UpdateShoppingItemDto) {
    return this.prisma.shoppingItem.update({
      select: selectShoppingItem,
      where: { shoppingListId: id, id: itemId },
      data,
    });
  }

  deleteItem(id: string, itemId: string) {
    return this.prisma.$transaction(async (em) => {
      const where = { id: itemId, shoppingListId: id };
      const item = await em.shoppingItem.findFirstOrThrow({
        select: { order: true },
        where,
      });
      await em.shoppingItem.deleteMany({ where });
      await em.shoppingItem.updateMany({
        data: { order: { decrement: 1 } },
        where: { shoppingListId: id, order: { gt: item.order } },
      });
    });
  }

  setItemIndex(id: string, itemId: string, data: SetShoppingItemIndexDto) {
    return this.prisma.$transaction(async (em) => {
      const agg = await em.shoppingItem.aggregate({
        _max: { order: true },
        where: { shoppingListId: id },
      });
      const where = { id: itemId, shoppingListId: id };
      const item = await em.shoppingItem.findFirstOrThrow({
        select: { order: true },
        where,
      });
      const from = item.order;
      const to = Math.min(agg._max.order, data.index);
      if (from > to) {
        await em.shoppingItem.updateMany({
          data: { order: { increment: 1 } },
          where: { shoppingListId: id, order: { gte: to, lt: from } },
        });
      } else if (from < to) {
        await em.shoppingItem.updateMany({
          data: { order: { decrement: 1 } },
          where: { shoppingListId: id, order: { gt: from, lte: to } },
        });
      }
      return em.shoppingItem.update({
        select: selectShoppingItem,
        data: { order: to },
        where,
      });
    });
  }
}
