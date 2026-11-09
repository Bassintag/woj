import { beforeEach, expect, test } from "bun:test";
import { conversions, ingredients, units } from "@woj/db";
import { createTestDb } from "../../lib/testing";
import { replaceConversions } from "./ingredient.lib";

const db = await createTestDb();

beforeEach(async () => {
  await db.delete(conversions);
  await db.delete(ingredients);
  await db.delete(units);
  await db.insert(units).values([
    { id: 1, title: "Pièce" },
    { id: 2, title: "Gramme" },
  ]);
  await db
    .insert(ingredients)
    .values({ id: 1, title: "Oeuf", calories: 100, defaultUnitId: 1 });
});

function list() {
  return db.transaction(async (tx) =>
    tx.select().from(conversions).orderBy(conversions.unitId),
  );
}

test("replaceConversions inserts the given conversions", async () => {
  await db.transaction((tx) =>
    replaceConversions(tx, 1, [{ unitId: 2, factor: 60 }]),
  );
  expect(await list()).toMatchObject([
    { ingredientId: 1, unitId: 2, factor: 60 },
  ]);
});

test("replaceConversions replaces existing conversions", async () => {
  await db.transaction((tx) =>
    replaceConversions(tx, 1, [{ unitId: 2, factor: 60 }]),
  );
  await db.transaction((tx) =>
    replaceConversions(tx, 1, [{ unitId: 1, factor: 2 }]),
  );
  expect(await list()).toMatchObject([{ unitId: 1, factor: 2 }]);
});

test("replaceConversions clears with an empty array", async () => {
  await db.transaction((tx) =>
    replaceConversions(tx, 1, [{ unitId: 2, factor: 60 }]),
  );
  await db.transaction((tx) => replaceConversions(tx, 1, []));
  expect(await list()).toEqual([]);
});
