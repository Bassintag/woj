import { recipes } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow, orThrow } from "../../lib/db";
import { orpc, scope } from "../../lib/orpc";
import { replaceRecipeRelations } from "./recipe.lib";
import { createRecipeQueries } from "./recipe.queries";

const scoped = orpc.recipes.use(scope(createRecipeQueries));

const list = scoped.list.handler(({ context }) => {
  return context.queries.list();
});

const get = scoped.get.handler(({ context, input }) => {
  return orThrow(context.queries.get({ id: input.id }));
});

const create = scoped.create.handler(async ({ context, input }) => {
  const { constituents, steps, tagIds, ...values } = input;
  const id = await context.db.transaction(async (tx) => {
    const inserted = await firstOrThrow(
      tx
        .insert(recipes)
        .values({ ...values, calories: 0 })
        .returning({
          id: recipes.id,
        }),
    );
    await replaceRecipeRelations(tx, inserted.id, {
      constituents,
      steps,
      tagIds,
    });
    return inserted.id;
  });
  return orThrow(context.queries.get({ id }));
});

const update = scoped.update.handler(async ({ context, input }) => {
  const { id, constituents, steps, tagIds, ...values } = input;
  await context.db.transaction(async (tx) => {
    await firstOrThrow(
      tx
        .update(recipes)
        .set({ id, ...values })
        .where(eq(recipes.id, id))
        .returning({ id: recipes.id }),
    );
    await replaceRecipeRelations(tx, id, { constituents, steps, tagIds });
  });
  return orThrow(context.queries.get({ id }));
});

const remove = scoped.remove.handler(async ({ context, input }) => {
  await context.db.transaction(async (tx) => {
    await replaceRecipeRelations(tx, input.id, {
      constituents: [],
      steps: [],
      tagIds: [],
    });
    await firstOrThrow(
      tx
        .delete(recipes)
        .where(eq(recipes.id, input.id))
        .returning({ id: recipes.id }),
    );
  });
});

export const recipeRouter = scoped.router({
  list,
  get,
  create,
  update,
  remove,
});
