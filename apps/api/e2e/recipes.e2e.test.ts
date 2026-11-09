import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];

beforeAll(async () => {
  ({ request } = await createTestApp());
});

const body = {
  title: "Omelette",
  bakingTime: 5,
  cookingTime: 10,
  constituents: [{ ingredientId: 1, unitId: 1, quantity: 2 }],
  steps: [{ description: "a" }],
  tagIds: [] as number[],
};

test("recipes are listed newest first with lightweight fields", async () => {
  const first = await request("POST", "/recipes", { body });
  const second = await request("POST", "/recipes", {
    body: { ...body, title: "Autre" },
  });
  const list = await request("GET", "/recipes");
  expect(list.status).toBe(200);
  expect(list.json.map((r: { id: number }) => r.id)).toEqual([
    second.json.id,
    first.json.id,
  ]);
  expect(list.json[0]).toMatchObject({
    calories: 200,
    constituents: [{ ingredient: { title: "Oeuf" } }],
  });
  expect(list.json[0]).not.toHaveProperty("steps");
});

test("recipe get returns details", async () => {
  const created = await request("POST", "/recipes", {
    body: { ...body, title: "Détail" },
  });
  const fetched = await request("GET", `/recipes/${created.json.id}`);
  expect(fetched.json).toMatchObject({
    title: "Détail",
    bakingTime: 5,
    cookingTime: 10,
    imageUrl: null,
    constituents: [{ quantity: 2, unit: { id: 1 }, ingredient: { id: 1 } }],
    steps: [{ description: "a" }],
  });
});

test("recipe create accepts missing times", async () => {
  const { bakingTime, cookingTime, ...rest } = body;
  const created = await request("POST", "/recipes", {
    body: { ...rest, title: "Sans temps" },
  });
  expect(created.status).toBe(200);
  expect(created.json.bakingTime).toBeNull();
  expect(created.json.cookingTime).toBeNull();
});

test("recipe patch updates scalars and keeps relations", async () => {
  const created = await request("POST", "/recipes", {
    body: { ...body, title: "Patch" },
  });
  const patched = await request("PATCH", `/recipes/${created.json.id}`, {
    body: { title: "Patché", bakingTime: null },
  });
  expect(patched.json).toMatchObject({
    title: "Patché",
    bakingTime: null,
    cookingTime: 10,
    calories: 200,
  });
  expect(patched.json.constituents).toHaveLength(1);
  expect(patched.json.steps).toHaveLength(1);
});

test("recipe patch replaces constituents and recomputes calories", async () => {
  const created = await request("POST", "/recipes", {
    body: { ...body, title: "Constituants" },
  });
  const patched = await request("PATCH", `/recipes/${created.json.id}`, {
    body: { constituents: [{ ingredientId: 1, unitId: 1, quantity: 5 }] },
  });
  expect(patched.json.calories).toBe(500);
  const cleared = await request("PATCH", `/recipes/${created.json.id}`, {
    body: { constituents: [] },
  });
  expect(cleared.json.calories).toBe(0);
});

test("recipe errors", async () => {
  expect((await request("GET", "/recipes/999")).status).toBe(404);
  expect(
    (await request("PATCH", "/recipes/999", { body: { title: "x" } })).status,
  ).toBe(404);
  expect((await request("DELETE", "/recipes/999")).status).toBe(404);
  expect((await request("PATCH", "/recipes/1", { body: {} })).status).toBe(400);
  for (const invalid of [
    { ...body, title: "" },
    { ...body, cookingTime: -1 },
    { ...body, constituents: [{ ingredientId: 1, unitId: 1, quantity: 0 }] },
    { ...body, steps: [{ description: " " }] },
    { ...body, tagIds: ["a"] },
  ]) {
    expect((await request("POST", "/recipes", { body: invalid })).status).toBe(
      400,
    );
  }
  const unique = { ...body, title: "Unique" };
  expect((await request("POST", "/recipes", { body: unique })).status).toBe(
    200,
  );
  expect((await request("POST", "/recipes", { body: unique })).status).toBe(
    409,
  );
  expect(
    (
      await request("POST", "/recipes", {
        body: {
          ...body,
          title: "Inconnu",
          constituents: [{ ingredientId: 99, unitId: 1, quantity: 1 }],
        },
      })
    ).status,
  ).toBe(409);
  expect(
    (
      await request("POST", "/recipes", {
        body: { ...body, title: "Tag inconnu", tagIds: [99] },
      })
    ).status,
  ).toBe(409);
});

test("failed recipe create leaves nothing behind", async () => {
  const before = await request("GET", "/recipes");
  await request("POST", "/recipes", {
    body: { ...body, title: "Ghost", tagIds: [99] },
  });
  const after = await request("GET", "/recipes");
  expect(after.json).toHaveLength(before.json.length);
});
