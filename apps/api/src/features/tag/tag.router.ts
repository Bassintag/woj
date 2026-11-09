import { tags } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow, orThrow } from "../../lib/db";
import { orpc, scope } from "../../lib/orpc";
import { createTagQueries } from "./tag.queries";

const scoped = orpc.tags.use(scope(createTagQueries));

const list = scoped.list.handler(({ context }) => {
  return context.queries.list();
});

const get = scoped.get.handler(({ context, input }) => {
  return orThrow(context.queries.get({ id: input.id }));
});

const create = scoped.create.handler(async ({ context, input }) => {
  const inserted = await firstOrThrow(
    context.db
      .insert(tags)
      .values({ title: input.title })
      .returning({ id: tags.id }),
  );
  return orThrow(context.queries.get({ id: inserted.id }));
});

const update = scoped.update.handler(async ({ context, input }) => {
  const { id, ...values } = input;
  await firstOrThrow(
    context.db
      .update(tags)
      .set(values)
      .where(eq(tags.id, id))
      .returning({ id: tags.id }),
  );
  return orThrow(context.queries.get({ id }));
});

const remove = scoped.remove.handler(async ({ context, input }) => {
  await firstOrThrow(
    context.db
      .delete(tags)
      .where(eq(tags.id, input.id))
      .returning({ id: tags.id }),
  );
});

export const tagRouter = scoped.router({
  list,
  get,
  create,
  update,
  remove,
});
