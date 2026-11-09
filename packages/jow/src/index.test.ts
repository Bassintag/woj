import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";
import { z } from "zod";
import { JowClient } from "./index";

const originalFetch = globalThis.fetch;
const fetchMock = mock();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("fetch sets headers and resolves the url against the base", async () => {
  fetchMock.mockResolvedValue(new Response("{}"));
  await new JowClient("https://example.com/").fetch("public/x");
  const [url, init] = fetchMock.mock.calls[0] ?? [];
  expect(url.href).toBe("https://example.com/public/x");
  expect(init.headers.get("accept")).toBe("application/json");
  expect(init.headers.get("accept-language")).toBe("fr");
  expect(init.keepalive).toBe(true);
});

test("fetch serializes json bodies", async () => {
  fetchMock.mockResolvedValue(new Response("{}"));
  await new JowClient().fetch("x", { method: "POST", json: ["a"] });
  const [, init] = fetchMock.mock.calls[0] ?? [];
  expect(init.body).toBe('["a"]');
  expect(init.headers.get("content-type")).toBe("application/json");
});

test("fetch throws the response text when not ok", async () => {
  fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
  expect(new JowClient().fetch("x")).rejects.toThrow("boom");
});

test("fetchJson parses the response with the schema", async () => {
  fetchMock.mockResolvedValue(Response.json({ a: 1 }));
  const result = await new JowClient().fetchJson(
    "x",
    z.object({ a: z.number() }),
  );
  expect(result).toEqual({ a: 1 });
});

test("fetchJson rejects data that does not match the schema", async () => {
  fetchMock.mockResolvedValue(Response.json({ a: "1" }));
  expect(
    new JowClient().fetchJson("x", z.object({ a: z.number() })),
  ).rejects.toThrow();
});
