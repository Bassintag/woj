import { defineRelations } from "drizzle-orm";
import { constituents } from "./tables/constituents";
import { ingredients } from "./tables/ingredients";
import { recipes } from "./tables/recipes";

export * from "./tables/constituents";
export * from "./tables/ingredients";
export * from "./tables/recipes";

export const relations = defineRelations(
  { recipes, constituents, ingredients },
  (t) => ({
    recipes: {
      constituents: t.many.constituents(),
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
    },
  }),
);
