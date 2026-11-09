import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];

beforeAll(async () => {
  ({ request } = await createTestApp());
});

test("units are listed by title with their symbols", async () => {
  const list = await request("GET", "/units");
  expect(list.status).toBe(200);
  expect(list.json.map((u: { title: string }) => u.title)).toEqual([
    "Gramme",
    "Pièce",
  ]);
  expect(list.json[0].symbols).toEqual([]);
});

test("unit errors", async () => {
  expect((await request("GET", "/units/99")).status).toBe(404);
  expect((await request("GET", "/units/abc")).status).toBe(400);
});

const gram = { title: "g", digits: 0, factor: 1 };
const kilo = { title: "kg", digits: 2, factor: 1000, min: 1 };

test("unit lifecycle", async () => {
  const created = await request("POST", "/units", {
    body: { title: "Litre", symbols: [kilo, gram] },
  });
  expect(created.status).toBe(200);
  expect(created.json.symbols.map((s: { title: string }) => s.title)).toEqual([
    "g",
    "kg",
  ]);
  const path = `/units/${created.json.id}`;

  const renamed = await request("PATCH", path, { body: { title: "Volume" } });
  expect(renamed.json.title).toBe("Volume");
  expect(renamed.json.symbols).toHaveLength(2);

  const replaced = await request("PATCH", path, {
    body: { symbols: [gram] },
  });
  expect(replaced.json.symbols).toHaveLength(1);

  expect((await request("DELETE", path)).status).toBe(200);
  expect((await request("GET", path)).status).toBe(404);
});

test("unit mutations require credentials", async () => {
  const body = { title: "x", symbols: [] };
  expect((await request("POST", "/units", { body, headers: {} })).status).toBe(
    401,
  );
  expect((await request("DELETE", "/units/1", { headers: {} })).status).toBe(
    401,
  );
});

test("unit mutation errors", async () => {
  expect(
    (await request("PATCH", "/units/999", { body: { title: "x" } })).status,
  ).toBe(404);
  expect((await request("DELETE", "/units/999")).status).toBe(404);
  expect((await request("PATCH", "/units/1", { body: {} })).status).toBe(400);
  for (const invalid of [
    { title: "", symbols: [] },
    { title: "x" },
    { title: "x", symbols: [{ ...gram, factor: 0 }] },
    { title: "x", symbols: [{ ...gram, digits: -1 }] },
  ]) {
    expect((await request("POST", "/units", { body: invalid })).status).toBe(
      400,
    );
  }
  expect(
    (
      await request("POST", "/units", {
        body: { title: "Gramme", symbols: [] },
      })
    ).status,
  ).toBe(409);
  expect((await request("DELETE", "/units/1")).status).toBe(409);
});

test("failed unit create leaves nothing behind", async () => {
  const before = await request("GET", "/units");
  const failed = await request("POST", "/units", {
    body: { title: "Ghost", symbols: [gram, gram] },
  });
  expect(failed.status).toBe(409);
  const after = await request("GET", "/units");
  expect(after.json).toHaveLength(before.json.length);
});
