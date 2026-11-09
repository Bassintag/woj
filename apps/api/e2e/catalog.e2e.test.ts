import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];

beforeAll(async () => {
  ({ request } = await createTestApp());
});

const recipeBody = {
  title: "Omelette",
  constituents: [{ ingredientId: 1, unitId: 1, quantity: 2 }],
  steps: [{ description: "a" }, { description: "b" }],
  tagIds: [] as number[],
};

test("units are read only", async () => {
  const list = await request("GET", "/units");
  expect(list.json).toHaveLength(2);
  expect((await request("GET", "/units/1")).json.title).toBe("Pièce");
  expect((await request("GET", "/units/99")).status).toBe(404);
});

test("ingredient conversions are replaced", async () => {
  const created = await request("POST", "/ingredients", {
    body: {
      title: "Farine",
      calories: 360,
      defaultUnitId: 2,
      conversions: [{ unitId: 1, factor: 50 }],
    },
  });
  expect(created.status).toBe(200);
  expect(created.json.conversions).toHaveLength(1);

  const patched = await request("PATCH", `/ingredients/${created.json.id}`, {
    body: { conversions: [] },
  });
  expect(patched.json.conversions).toHaveLength(0);
  expect(patched.json.calories).toBe(360);

  expect(
    (await request("DELETE", `/ingredients/${created.json.id}`)).status,
  ).toBe(200);
});

test("recipe lifecycle recomputes calories", async () => {
  const tag = await request("POST", "/tags", { body: { title: "vegan" } });
  const created = await request("POST", "/recipes", {
    body: { ...recipeBody, tagIds: [tag.json.id] },
  });
  expect(created.status).toBe(200);
  expect(created.json.calories).toBe(200);
  expect(
    created.json.steps.map((s: { description: string }) => s.description),
  ).toEqual(["a", "b"]);
  expect(created.json.tags).toHaveLength(1);

  await request("PATCH", "/ingredients/1", { body: { calories: 50 } });
  const reread = await request("GET", `/recipes/${created.json.id}`);
  expect(reread.json.calories).toBe(100);

  const patched = await request("PATCH", `/recipes/${created.json.id}`, {
    body: { steps: [{ description: "c" }], tagIds: [] },
  });
  expect(patched.json.steps).toHaveLength(1);
  expect(patched.json.tags).toHaveLength(0);
  expect(patched.json.constituents).toHaveLength(1);

  const removed = await request("DELETE", `/recipes/${created.json.id}`);
  expect(removed.status).toBe(200);
});

test("referenced resources cannot be deleted", async () => {
  const recipe = await request("POST", "/recipes", {
    body: { ...recipeBody, title: "Referenced" },
  });
  expect((await request("DELETE", "/ingredients/1")).status).toBe(409);

  const menu = await request("POST", "/menus", {
    body: { title: "M", meals: [{ recipeId: recipe.json.id, quantity: 2 }] },
  });
  expect(menu.status).toBe(200);
  expect(menu.json.meals).toHaveLength(1);
  expect((await request("DELETE", `/recipes/${recipe.json.id}`)).status).toBe(
    409,
  );

  const emptied = await request("PATCH", `/menus/${menu.json.id}`, {
    body: { meals: [] },
  });
  expect(emptied.json.meals).toHaveLength(0);
  expect((await request("DELETE", `/menus/${menu.json.id}`)).status).toBe(200);
  expect((await request("DELETE", `/recipes/${recipe.json.id}`)).status).toBe(
    200,
  );
});

test("menu update rolls back on duplicate recipes", async () => {
  const recipe = await request("POST", "/recipes", {
    body: { ...recipeBody, title: "Rollback" },
  });
  const menu = await request("POST", "/menus", {
    body: { title: "R", meals: [{ recipeId: recipe.json.id, quantity: 1 }] },
  });
  const duplicate = { recipeId: recipe.json.id, quantity: 1 };
  const failed = await request("PATCH", `/menus/${menu.json.id}`, {
    body: { title: "changed", meals: [duplicate, duplicate] },
  });
  expect(failed.status).toBe(409);
  const reread = await request("GET", `/menus/${menu.json.id}`);
  expect(reread.json.title).toBe("R");
  expect(reread.json.meals).toHaveLength(1);
});
