import { beforeAll, expect, test } from "bun:test";
import { createTestApp } from "./helpers";

let request: Awaited<ReturnType<typeof createTestApp>>["request"];

beforeAll(async () => {
  ({ request } = await createTestApp());
});

test("GET routes are public", async () => {
  for (const path of [
    "/tags",
    "/units",
    "/ingredients",
    "/recipes",
    "/menus",
  ]) {
    expect((await request("GET", path, { headers: {} })).status).toBe(200);
  }
});

test("mutations require credentials", async () => {
  const body = { title: "a" };
  expect((await request("POST", "/tags", { body, headers: {} })).status).toBe(
    401,
  );
  expect(
    (await request("POST", "/tags", { body, headers: { "x-api-key": "no" } }))
      .status,
  ).toBe(401);
  expect((await request("POST", "/tags", { body })).status).toBe(200);
});

test("mutations accept basic auth", async () => {
  const authorization = `Basic ${btoa("admin:pw")}`;
  const response = await request("POST", "/tags", {
    body: { title: "basic" },
    headers: { authorization },
  });
  expect(response.status).toBe(200);
});
