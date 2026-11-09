import { beforeEach, expect, test } from "bun:test";
import { meals, menus, recipes } from "@woj/db";
import { createTestDb } from "../../lib/testing";
import { replaceMeals } from "./menu.lib";

const db = await createTestDb();

beforeEach(async () => {
  await db.delete(meals);
  await db.delete(menus);
  await db.delete(recipes);
  await db.insert(recipes).values([
    { id: 1, title: "a", calories: 0 },
    { id: 2, title: "b", calories: 0 },
  ]);
  await db.insert(menus).values({ id: 1, title: "M" });
});

function list() {
  return db.select().from(meals).orderBy(meals.order);
}

test("replaceMeals orders meals by index", async () => {
  await db.transaction((tx) =>
    replaceMeals(tx, 1, [
      { recipeId: 2, quantity: 3 },
      { recipeId: 1, quantity: 1 },
    ]),
  );
  expect(await list()).toMatchObject([
    { recipeId: 2, quantity: 3, order: 0, menuId: 1 },
    { recipeId: 1, quantity: 1, order: 1, menuId: 1 },
  ]);
});

test("replaceMeals replaces existing meals", async () => {
  await db.transaction((tx) =>
    replaceMeals(tx, 1, [{ recipeId: 1, quantity: 1 }]),
  );
  await db.transaction((tx) =>
    replaceMeals(tx, 1, [{ recipeId: 2, quantity: 2 }]),
  );
  expect(await list()).toMatchObject([{ recipeId: 2, quantity: 2 }]);
});

test("replaceMeals clears with an empty array", async () => {
  await db.transaction((tx) =>
    replaceMeals(tx, 1, [{ recipeId: 1, quantity: 1 }]),
  );
  await db.transaction((tx) => replaceMeals(tx, 1, []));
  expect(await list()).toEqual([]);
});

test("replaceMeals rolls back on duplicate recipes", async () => {
  await db.transaction((tx) =>
    replaceMeals(tx, 1, [{ recipeId: 1, quantity: 1 }]),
  );
  await db
    .transaction((tx) =>
      replaceMeals(tx, 1, [
        { recipeId: 2, quantity: 1 },
        { recipeId: 2, quantity: 1 },
      ]),
    )
    .catch(() => undefined);
  expect(await list()).toMatchObject([{ recipeId: 1 }]);
});
