import { Prisma } from '@prisma/client';
import { selectEntity } from '../../const/entity.const';
import { selectIngredient } from '../recipe/recipe.const';

export const selectShoppingItem = {
  ...selectEntity,
  name: true,
  purchased: true,
  ingredient: { select: selectIngredient },
} satisfies Prisma.ShoppingItemSelect;

export const selectShoppingList = {
  ...selectEntity,
  createdAt: true,
  items: { select: selectShoppingItem, orderBy: { order: 'asc' } },
} satisfies Prisma.ShoppingListSelect;
