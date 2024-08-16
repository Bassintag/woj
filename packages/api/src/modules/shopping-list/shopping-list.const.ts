import { Prisma } from '@prisma/client';
import { entitySelect } from '../../const/entity.const';
import { ingredientSelect } from '../recipe/recipe.const';

export const selectShoppingItem = {
  ...entitySelect,
  name: true,
  purchased: true,
  ingredient: { select: ingredientSelect },
} satisfies Prisma.ShoppingItemSelect;

export const selectShoppingList = {
  ...entitySelect,
  createdAt: true,
  items: { select: selectShoppingItem, orderBy: { order: 'asc' } },
} satisfies Prisma.ShoppingListSelect;
