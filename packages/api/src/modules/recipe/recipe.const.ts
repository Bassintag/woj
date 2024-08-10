import { Prisma } from '@prisma/client';
import { entitySelect } from '../../const/entity.const';

export const recipeSelect = {
  ...entitySelect,
  name: true,
  imagePath: true,
  preppingTime: true,
  cookingTime: true,
  steps: {
    select: {
      ...entitySelect,
      description: true,
    },
    orderBy: { order: 'asc' },
  },
  ingredients: {
    select: {
      ...entitySelect,
      quantity: true,
      ingredient: {
        select: {
          ...entitySelect,
          name: true,
          imagePath: true,
          energy: true,
        },
      },
      unit: {
        select: {
          ...entitySelect,
          name: true,
          symbol: true,
        },
      },
    },
  },
} satisfies Prisma.RecipeSelect;
