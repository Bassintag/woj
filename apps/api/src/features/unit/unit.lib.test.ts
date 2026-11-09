import { beforeEach, expect, test } from "bun:test";
import { symbols, units } from "@woj/db";
import { createTestDb } from "../../lib/testing";
import { replaceSymbols } from "./unit.lib";

const db = await createTestDb();

beforeEach(async () => {
  await db.delete(symbols);
  await db.delete(units);
  await db.insert(units).values({ id: 1, title: "Gramme" });
});

function list() {
  return db.select().from(symbols).orderBy(symbols.factor);
}

const gram = { title: "g", digits: 0, factor: 1 };
const kilo = { title: "kg", digits: 2, factor: 1000, min: 1 };

test("replaceSymbols inserts the given symbols", async () => {
  await db.transaction((tx) => replaceSymbols(tx, 1, [gram, kilo]));
  expect(await list()).toMatchObject([
    { title: "g", unitId: 1, min: null },
    { title: "kg", unitId: 1, min: 1 },
  ]);
});

test("replaceSymbols replaces existing symbols", async () => {
  await db.transaction((tx) => replaceSymbols(tx, 1, [gram]));
  await db.transaction((tx) => replaceSymbols(tx, 1, [kilo]));
  expect(await list()).toMatchObject([{ title: "kg" }]);
});

test("replaceSymbols clears with an empty array", async () => {
  await db.transaction((tx) => replaceSymbols(tx, 1, [gram]));
  await db.transaction((tx) => replaceSymbols(tx, 1, []));
  expect(await list()).toEqual([]);
});
