import { beforeAll, expect, test } from "bun:test";
import { ORPCError } from "@orpc/server";
import { tags } from "@woj/db";
import { isConstraintError, orThrow, query } from "./db";
import { createTestDb } from "./testing";

const db = await createTestDb();

beforeAll(async () => {
  await db.insert(tags).values([{ title: "b" }, { title: "a" }]);
});

test("orThrow returns the resolved value", async () => {
  expect(await orThrow(Promise.resolve({ id: 1 }))).toEqual({ id: 1 });
  expect(await orThrow(Promise.resolve(0))).toBe(0);
});

test("orThrow throws NOT_FOUND on null and undefined", async () => {
  for (const value of [null, undefined]) {
    const error = await orThrow(Promise.resolve(value)).catch((e) => e);
    expect(error).toBeInstanceOf(ORPCError);
    expect(error.code).toBe("NOT_FOUND");
  }
});

test("query executes a prepared query without params", async () => {
  const list = query(() =>
    db.query.tags.findMany({ orderBy: { title: "asc" } }),
  );
  expect((await list()).map((tag) => tag.title)).toEqual(["a", "b"]);
});

test("query binds params to the prepared statement", async () => {
  const get = query((p: { id: number }) =>
    db.query.tags.findFirst({ where: { id: p.id } }),
  );
  expect((await get({ id: 1 }))?.title).toBe("b");
  expect((await get({ id: 2 }))?.title).toBe("a");
  expect(await get({ id: 99 })).toBeUndefined();
});

test("query prepares the statement only once", async () => {
  let builds = 0;
  const get = query((p: { id: number }) => {
    builds++;
    return db.query.tags.findFirst({ where: { id: p.id } });
  });
  await get({ id: 1 });
  await get({ id: 2 });
  expect(builds).toBe(1);
});

test("isConstraintError detects unique violations through the cause chain", async () => {
  const error = await db
    .insert(tags)
    .values({ title: "a" })
    .then(
      () => null,
      (e) => e,
    );
  expect(isConstraintError(error)).toBe(true);
  expect(isConstraintError(new Error("nope"))).toBe(false);
  expect(isConstraintError(null)).toBe(false);
});
