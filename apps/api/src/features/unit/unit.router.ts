import { units } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow, orThrow } from "../../lib/db";
import { orpc, scope } from "../../lib/orpc";
import { replaceSymbols } from "./unit.lib";
import { createUnitQueries } from "./unit.queries";

const scoped = orpc.units.use(scope(createUnitQueries));

const list = scoped.list.handler(({ context }) => {
  return context.queries.list();
});

const get = scoped.get.handler(({ context, input }) => {
  return orThrow(context.queries.get({ id: input.id }));
});

const create = scoped.create.handler(async ({ context, input }) => {
  const { symbols, ...values } = input;
  const id = await context.db.transaction(async (tx) => {
    const inserted = await firstOrThrow(
      tx.insert(units).values(values).returning({ id: units.id }),
    );
    await replaceSymbols(tx, inserted.id, symbols);
    return inserted.id;
  });
  return orThrow(context.queries.get({ id }));
});

const update = scoped.update.handler(async ({ context, input }) => {
  const { id, symbols, ...values } = input;
  await context.db.transaction(async (tx) => {
    await firstOrThrow(
      tx
        .update(units)
        .set({ id, ...values })
        .where(eq(units.id, id))
        .returning({ id: units.id }),
    );
    if (symbols) await replaceSymbols(tx, id, symbols);
  });
  return orThrow(context.queries.get({ id }));
});

const remove = scoped.remove.handler(async ({ context, input }) => {
  await context.db.transaction(async (tx) => {
    await replaceSymbols(tx, input.id, []);
    await firstOrThrow(
      tx
        .delete(units)
        .where(eq(units.id, input.id))
        .returning({ id: units.id }),
    );
  });
});

export const unitRouter = scoped.router({
  list,
  get,
  create,
  update,
  remove,
});
