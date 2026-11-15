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

const basic = { authorization: `Basic ${btoa("admin:pw")}` };

test("tokens can be created with basic auth", async () => {
  const response = await request("POST", "/tokens", { headers: basic });
  expect(response.status).toBe(200);
  expect(typeof response.json.access).toBe("string");
  expect(typeof response.json.refresh).toBe("string");
});

test("tokens require basic auth or a refresh token", async () => {
  const { json } = await request("POST", "/tokens", { headers: basic });
  const bearer = (token: string) => ({ authorization: `Bearer ${token}` });
  expect((await request("POST", "/tokens", { headers: {} })).status).toBe(401);
  expect(
    (
      await request("POST", "/tokens", {
        headers: { authorization: `Basic ${btoa("admin:no")}` },
      })
    ).status,
  ).toBe(401);
  expect(
    (await request("POST", "/tokens", { headers: bearer(json.access) })).status,
  ).toBe(401);
  expect(
    (await request("POST", "/tokens", { headers: bearer(json.refresh) }))
      .status,
  ).toBe(200);
});

test("mutations accept an access token but not basic auth or a refresh token", async () => {
  const { json } = await request("POST", "/tokens", { headers: basic });
  const post = (headers: Record<string, string>) =>
    request("POST", "/tags", { body: { title: "jwt" }, headers });
  expect((await post(basic)).status).toBe(401);
  expect((await post({ authorization: `Bearer ${json.refresh}` })).status).toBe(
    401,
  );
  expect((await post({ authorization: `Bearer ${json.access}` })).status).toBe(
    200,
  );
});
