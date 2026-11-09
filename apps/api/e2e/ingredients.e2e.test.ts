import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];

beforeAll(async () => {
  ({ request } = await createTestApp());
});

const body = {
  title: "Farine",
  calories: 360,
  defaultUnitId: 2,
  conversions: [{ unitId: 1, factor: 50 }],
};

test("ingredients are listed newest first", async () => {
  const created = await request("POST", "/ingredients", { body });
  const list = await request("GET", "/ingredients");
  expect(list.status).toBe(200);
  expect(list.json.map((i: { id: number }) => i.id)).toEqual([
    created.json.id,
    1,
  ]);
});

test("ingredient get returns unit and conversions", async () => {
  const created = await request("POST", "/ingredients", {
    body: { ...body, title: "Sucre" },
  });
  const fetched = await request("GET", `/ingredients/${created.json.id}`);
  expect(fetched.status).toBe(200);
  expect(fetched.json).toMatchObject({
    title: "Sucre",
    calories: 360,
    defaultUnit: { id: 2, title: "Gramme" },
    conversions: [{ factor: 50, unit: { id: 1 } }],
  });
});

test("ingredient patch updates scalars and keeps conversions", async () => {
  const created = await request("POST", "/ingredients", {
    body: { ...body, title: "Sel" },
  });
  const patched = await request("PATCH", `/ingredients/${created.json.id}`, {
    body: { title: "Sel fin", defaultUnitId: 1 },
  });
  expect(patched.json).toMatchObject({
    title: "Sel fin",
    defaultUnit: { id: 1 },
  });
  expect(patched.json.conversions).toHaveLength(1);
});

test("ingredient patch replaces conversions", async () => {
  const created = await request("POST", "/ingredients", {
    body: { ...body, title: "Riz" },
  });
  const patched = await request("PATCH", `/ingredients/${created.json.id}`, {
    body: { conversions: [{ unitId: 2, factor: 2 }] },
  });
  expect(patched.json.conversions).toMatchObject([
    { factor: 2, unit: { id: 2 } },
  ]);
});

test("ingredient errors", async () => {
  expect((await request("GET", "/ingredients/999")).status).toBe(404);
  expect(
    (await request("PATCH", "/ingredients/999", { body: { title: "x" } }))
      .status,
  ).toBe(404);
  expect((await request("DELETE", "/ingredients/999")).status).toBe(404);
  expect((await request("PATCH", "/ingredients/1", { body: {} })).status).toBe(
    400,
  );
  for (const invalid of [
    { ...body, title: "" },
    { ...body, calories: -1 },
    { ...body, calories: 1.5 },
    { ...body, defaultUnitId: 0 },
    { ...body, conversions: [{ unitId: 1, factor: 0 }] },
  ]) {
    expect(
      (await request("POST", "/ingredients", { body: invalid })).status,
    ).toBe(400);
  }
  expect(
    (
      await request("POST", "/ingredients", {
        body: { ...body, title: "Oeuf" },
      })
    ).status,
  ).toBe(409);
  expect(
    (
      await request("POST", "/ingredients", {
        body: { ...body, title: "U", defaultUnitId: 99 },
      })
    ).status,
  ).toBe(409);
  const duplicated = { unitId: 1, factor: 1 };
  expect(
    (
      await request("POST", "/ingredients", {
        body: { ...body, title: "D", conversions: [duplicated, duplicated] },
      })
    ).status,
  ).toBe(409);
});

test("failed ingredient create leaves nothing behind", async () => {
  const before = await request("GET", "/ingredients");
  const duplicated = { unitId: 1, factor: 1 };
  await request("POST", "/ingredients", {
    body: { ...body, title: "Ghost", conversions: [duplicated, duplicated] },
  });
  const after = await request("GET", "/ingredients");
  expect(after.json).toHaveLength(before.json.length);
});
