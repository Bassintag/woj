import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];
let recipeIds: number[];

beforeAll(async () => {
  ({ request } = await createTestApp());
  recipeIds = [];
  for (const title of ["A", "B"]) {
    const recipe = await request("POST", "/recipes", {
      body: {
        title,
        constituents: [],
        steps: [],
        tagIds: [],
      },
    });
    recipeIds.push(recipe.json.id);
  }
});

function meals(...ids: number[]) {
  return ids.map((recipeId, index) => ({ recipeId, quantity: index + 1 }));
}

test("menus are listed newest first", async () => {
  const first = await request("POST", "/menus", {
    body: { title: "1", meals: [] },
  });
  const second = await request("POST", "/menus", {
    body: { title: "2", meals: [] },
  });
  const list = await request("GET", "/menus");
  expect(list.status).toBe(200);
  expect(list.json.map((m: { id: number }) => m.id)).toEqual([
    second.json.id,
    first.json.id,
  ]);
});

test("menu meals keep the given order", async () => {
  const [a, b] = recipeIds as [number, number];
  const created = await request("POST", "/menus", {
    body: { title: "Ordre", meals: meals(b, a) },
  });
  const fetched = await request("GET", `/menus/${created.json.id}`);
  expect(
    fetched.json.meals.map(
      (m: { recipe: { id: number }; quantity: number }) => [
        m.recipe.id,
        m.quantity,
      ],
    ),
  ).toEqual([
    [b, 1],
    [a, 2],
  ]);
});

test("menu patch replaces meals and keeps them when omitted", async () => {
  const [a, b] = recipeIds as [number, number];
  const created = await request("POST", "/menus", {
    body: { title: "Patch", meals: meals(a) },
  });
  const renamed = await request("PATCH", `/menus/${created.json.id}`, {
    body: { title: "Renommé" },
  });
  expect(renamed.json.title).toBe("Renommé");
  expect(renamed.json.meals).toHaveLength(1);
  const replaced = await request("PATCH", `/menus/${created.json.id}`, {
    body: { meals: meals(b, a) },
  });
  expect(
    replaced.json.meals.map((m: { recipe: { id: number } }) => m.recipe.id),
  ).toEqual([b, a]);
});

test("menu errors", async () => {
  const [a] = recipeIds as [number];
  expect((await request("GET", "/menus/999")).status).toBe(404);
  expect(
    (await request("PATCH", "/menus/999", { body: { title: "x" } })).status,
  ).toBe(404);
  expect((await request("DELETE", "/menus/999")).status).toBe(404);
  for (const invalid of [
    { title: "", meals: [] },
    { title: "x", meals: [{ recipeId: a, quantity: 0 }] },
    { title: "x", meals: [{ recipeId: a, quantity: 1.5 }] },
    { title: "x" },
  ]) {
    expect((await request("POST", "/menus", { body: invalid })).status).toBe(
      400,
    );
  }
  expect(
    (
      await request("POST", "/menus", {
        body: { title: "x", meals: meals(99) },
      })
    ).status,
  ).toBe(409);
  expect(
    (
      await request("POST", "/menus", {
        body: { title: "x", meals: meals(a, a) },
      })
    ).status,
  ).toBe(409);
});

test("failed menu create leaves nothing behind", async () => {
  const before = await request("GET", "/menus");
  await request("POST", "/menus", {
    body: { title: "Ghost", meals: meals(99) },
  });
  const after = await request("GET", "/menus");
  expect(after.json).toHaveLength(before.json.length);
});

test("unknown routes fall through", async () => {
  const response = await request("GET", "/nope");
  expect(response.json).toEqual({ error: "Not found" });
});
