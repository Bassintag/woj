import { menus } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow, orThrow } from "../../lib/db";
import { orpc, scope } from "../../lib/orpc";
import { replaceMeals } from "./menu.lib";
import { createMenuQueries } from "./menu.queries";

const scoped = orpc.menus.use(scope(createMenuQueries));

const list = scoped.list.handler(({ context }) => {
  return context.queries.list();
});

const get = scoped.get.handler(({ context, input }) => {
  return orThrow(context.queries.get({ id: input.id }));
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
  return orThrow(context.queries.get({ id }));
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
  return orThrow(context.queries.get({ id }));
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
