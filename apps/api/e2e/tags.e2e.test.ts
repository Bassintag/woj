import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];

beforeAll(async () => {
  ({ request } = await createTestApp());
});

test("tag lifecycle", async () => {
  const created = await request("POST", "/tags", { body: { title: "b" } });
  expect(created.status).toBe(200);
  await request("POST", "/tags", { body: { title: "a" } });

  const list = await request("GET", "/tags");
  expect(list.json.map((t: { title: string }) => t.title)).toEqual(["a", "b"]);

  const patched = await request("PATCH", `/tags/${created.json.id}`, {
    body: { title: "c" },
  });
  expect(patched.json.title).toBe("c");

  expect((await request("DELETE", `/tags/${created.json.id}`)).status).toBe(
    200,
  );
  expect((await request("GET", `/tags/${created.json.id}`)).status).toBe(404);
});

test("tag errors", async () => {
  expect((await request("GET", "/tags/999")).status).toBe(404);
  expect(
    (await request("PATCH", "/tags/999", { body: { title: "x" } })).status,
  ).toBe(404);
  expect(
    (await request("POST", "/tags", { body: { title: " " } })).status,
  ).toBe(400);
  expect((await request("GET", "/tags/abc")).status).toBe(400);
  await request("POST", "/tags", { body: { title: "dup" } });
  expect(
    (await request("POST", "/tags", { body: { title: "dup" } })).status,
  ).toBe(409);
});
