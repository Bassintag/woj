import { menus } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow, orThrow } from "../../lib/db";
import { orpc, scope } from "../../lib/orpc";
import { toRecipe } from "../recipe/recipe.lib";
import { replaceMeals } from "./menu.lib";
import { createMenuQueries } from "./menu.queries";

const scoped = orpc.menus.use(scope(createMenuQueries));

type Menu = Awaited<
  ReturnType<ReturnType<typeof createMenuQueries>["list"]>
>[number];

function toMenu({ meals, ...menu }: Menu) {
  return {
    ...menu,
    meals: meals.map(({ recipe, ...meal }) => ({
      ...meal,
      recipe: toRecipe(recipe),
    })),
  };
}

const list = scoped.list.handler(async ({ context }) => {
  return (await context.queries.list()).map(toMenu);
});

const get = scoped.get.handler(async ({ context, input }) => {
  return toMenu(await orThrow(context.queries.get({ id: input.id })));
});

const create = scoped.create.handler(async ({ context, input }) => {
  const { meals, ...values } = input;
  const id = await context.db.transaction(async (tx) => {
    const inserted = await firstOrThrow(
      tx.insert(menus).values(values).returning({ id: menus.id }),
    );
    await replaceMeals(tx, inserted.id, meals);
    return inserted.id;
  });
  return toMenu(await orThrow(context.queries.get({ id })));
});

const update = scoped.update.handler(async ({ context, input }) => {
  const { id, meals, ...values } = input;
  await context.db.transaction(async (tx) => {
    await firstOrThrow(
      tx
        .update(menus)
        .set({ id, ...values })
        .where(eq(menus.id, id))
        .returning({ id: menus.id }),
    );
    if (meals) await replaceMeals(tx, id, meals);
  });
  return toMenu(await orThrow(context.queries.get({ id })));
});

const remove = scoped.remove.handler(async ({ context, input }) => {
  await context.db.transaction(async (tx) => {
    await replaceMeals(tx, input.id, []);
    await firstOrThrow(
      tx
        .delete(menus)
        .where(eq(menus.id, input.id))
        .returning({ id: menus.id }),
    );
  });
});

export const menuRouter = scoped.router({
  list,
  get,
  create,
  update,
  remove,
});
