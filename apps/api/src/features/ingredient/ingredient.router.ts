import { constituents, ingredients } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow, orThrow } from "../../lib/db";
import { orpc, scope } from "../../lib/orpc";
import { recomputeRecipeCalories } from "../recipe/recipe.lib";
import { replaceConversions } from "./ingredient.lib";
import { createIngredientQueries } from "./ingredient.queries";

const scoped = orpc.ingredients.use(scope(createIngredientQueries));

const list = scoped.list.handler(({ context }) => {
  return context.queries.list();
});

const get = scoped.get.handler(({ context, input }) => {
  return orThrow(context.queries.get({ id: input.id }));
});

const create = scoped.create.handler(async ({ context, input }) => {
  const { conversions, ...values } = input;
  const id = await context.db.transaction(async (tx) => {
    const inserted = await firstOrThrow(
      tx.insert(ingredients).values(values).returning({ id: ingredients.id }),
    );
    await replaceConversions(tx, inserted.id, conversions);
    return inserted.id;
  });
  return orThrow(context.queries.get({ id }));
});

const update = scoped.update.handler(async ({ context, input }) => {
  const { id, conversions, ...values } = input;
  await context.db.transaction(async (tx) => {
    await firstOrThrow(
      tx
        .update(ingredients)
        .set({ id, ...values })
        .where(eq(ingredients.id, id))
        .returning({ id: ingredients.id }),
    );
    if (conversions) await replaceConversions(tx, id, conversions);
    const affected = await tx
      .selectDistinct({ id: constituents.recipeId })
      .from(constituents)
      .where(eq(constituents.ingredientId, id));
    for (const recipe of affected) {
      await recomputeRecipeCalories(tx, recipe.id);
    }
  });
  return orThrow(context.queries.get({ id }));
});

const remove = scoped.remove.handler(async ({ context, input }) => {
  await context.db.transaction(async (tx) => {
    await replaceConversions(tx, input.id, []);
    await firstOrThrow(
      tx
        .delete(ingredients)
        .where(eq(ingredients.id, input.id))
        .returning({ id: ingredients.id }),
    );
  });
});

export const ingredientRouter = scoped.router({
  list,
  get,
  create,
  update,
  remove,
});
