import { Prisma } from '@prisma/client';
import { entitySelect } from '../../const/entity.const';

export const ingredientSelect = {
  ...entitySelect,
  name: true,
  imagePath: true,
  energy: true,
  unit: {
    select: {
      ...entitySelect,
      name: true,
      symbols: {
        select: {
          ...entitySelect,
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
        select: ingredientSelect,
      },
    },
    orderBy: { ingredient: { name: 'asc' } },
  },
} satisfies Prisma.RecipeSelect;
