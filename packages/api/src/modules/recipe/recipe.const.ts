import { Prisma } from '@prisma/client';
import { selectEntity } from '../../const/entity.const';
import { selectTag } from '../tag/tag.const';

export const selectIngredient = {
  ...selectEntity,
  name: true,
  imagePath: true,
  energy: true,
  unit: {
    select: {
      ...selectEntity,
      name: true,
      symbols: {
        select: {
          ...selectEntity,
          name: true,
          factor: true,
          digits: true,
          min: true,
          max: true,
        },
      },
    },
  },
} satisfies Prisma.IngredientSelect;

export const selectRecipe = {
  ...selectEntity,
  name: true,
  imagePath: true,
  preppingTime: true,
  cookingTime: true,
  steps: {
    select: {
      ...selectEntity,
      description: true,
    },
    orderBy: { order: 'asc' },
  },
  ingredients: {
    select: {
      ...selectEntity,
      quantity: true,
      ingredient: {
        select: selectIngredient,
      },
    },
    orderBy: { ingredient: { name: 'asc' } },
  },
  tags: {
    select: selectTag,
    orderBy: { name: 'asc' },
  },
} satisfies Prisma.RecipeSelect;
