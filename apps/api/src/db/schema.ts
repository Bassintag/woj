import { defineRelations } from "drizzle-orm";
import { constituents } from "./tables/constituents";
import { conversions } from "./tables/conversions";
import { ingredients } from "./tables/ingredients";
import { meals } from "./tables/meals";
import { menus } from "./tables/menus";
import { recipes } from "./tables/recipes";
import { recipesToTags } from "./tables/recipesToTags";
import { steps } from "./tables/steps";
import { symbols } from "./tables/symbols";
import { tags } from "./tables/tags";
import { units } from "./tables/units";

export * from "./tables/constituents";
export * from "./tables/conversions";
export * from "./tables/ingredients";
export * from "./tables/meals";
export * from "./tables/menus";
export * from "./tables/recipes";
export * from "./tables/recipesToTags";
export * from "./tables/steps";
export * from "./tables/symbols";
export * from "./tables/tags";
export * from "./tables/units";

export const relations = defineRelations(
  {
    constituents,
    conversions,
    ingredients,
    meals,
    menus,
    recipes,
    recipesToTags,
    steps,
    symbols,
    tags,
    units,
  },
  (t) => ({
    conversions: {
      ingredient: t.one.ingredients({
        optional: false,
        from: t.conversions.ingredientId,
        to: t.ingredients.id,
      }),
      unit: t.one.units({
        optional: false,
        from: t.conversions.unitId,
        to: t.units.id,
      }),
    },
    constituents: {
      recipe: t.one.recipes({
        optional: false,
        from: t.constituents.recipeId,
        to: t.recipes.id,
      }),
      ingredient: t.one.ingredients({
        optional: false,
        from: t.constituents.indredientId,
        to: t.ingredients.id,
      }),
    },
    ingredients: {
      constituents: t.many.constituents(),
      conversions: t.many.conversions(),
      defaultUnit: t.one.units({
        optional: false,
        from: t.ingredients.defaultUnitId,
        to: t.units.id,
      }),
    },
    recipes: {
      constituents: t.many.constituents(),
      meals: t.many.meals(),
      steps: t.many.steps(),
      tags: t.many.tags({
        from: t.recipes.id.through(t.recipesToTags.recipeId),
        to: t.tags.id.through(t.recipesToTags.tagId),
      }),
    },
    meals: {
      menu: t.one.menus({
        optional: false,
        from: t.meals.menuId,
        to: t.menus.id,
      }),
      recipe: t.one.recipes({
        optional: false,
        from: t.meals.recipeId,
        to: t.recipes.id,
      }),
    },
    menus: {
      meals: t.many.meals(),
    },
    steps: {
      recipe: t.one.recipes({
        optional: false,
        from: t.steps.recipeId,
        to: t.recipes.id,
      }),
    },
    symbols: {
      unit: t.one.units({
        optional: false,
        from: t.symbols.unitId,
        to: t.units.id,
      }),
    },
    units: {
      conversions: t.many.conversions(),
      symbols: t.many.symbols(),
    },
  }),
);
