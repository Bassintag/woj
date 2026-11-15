import { afterEach, beforeEach, expect, test } from "bun:test";
import { useAuthStore } from "../hooks/useAuthStore";
import { getAccessToken, login } from "./auth";
import { orpc } from "./orpc";

const realFetch = globalThis.fetch;
const realWindow = globalThis.window;
let calls: Request[];

function jwt(payload: object) {
  return `h.${btoa(JSON.stringify(payload))}.s`;
}

function access(expiresIn: number) {
  return jwt({ typ: "access", exp: Date.now() / 1000 + expiresIn });
}

function refreshToken(expiresIn: number, id = "r") {
  return jwt({ typ: "refresh", exp: Date.now() / 1000 + expiresIn, id });
}

const validRefresh = refreshToken(3600);
const newRefresh = refreshToken(3600, "new");

beforeEach(() => {
  calls = [];
  useAuthStore.getState().clear();
  globalThis.window = { location: { origin: "http://x" } } as never;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push(new Request(url, init));
    await Promise.resolve();
    return Response.json({ access: access(300), refresh: newRefresh });
  }) as never;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  globalThis.window = realWindow;
});

test("login stores the tokens using basic auth", async () => {
  await login("admin", "pw");
  expect(calls[0]?.headers.get("authorization")).toBe(
    `Basic ${btoa("admin:pw")}`,
  );
  expect(useAuthStore.getState().tokens?.refresh.raw).toBe(newRefresh);
});

test("no tokens means no access token", async () => {
  expect(await getAccessToken()).toBeUndefined();
  expect(calls).toHaveLength(0);
});

test("a fresh access token is used as is", async () => {
  const fresh = access(300);
  useAuthStore.getState().setTokens({ access: fresh, refresh: validRefresh });
  expect(await getAccessToken()).toBe(fresh);
  expect(calls).toHaveLength(0);
});

test("an expiring access token is refreshed once for concurrent calls", async () => {
  useAuthStore
    .getState()
    .setTokens({ access: access(5), refresh: validRefresh });
  const [a, b] = await Promise.all([getAccessToken(), getAccessToken()]);
  expect(calls).toHaveLength(1);
  expect(calls[0]?.headers.get("authorization")).toBe(`Bearer ${validRefresh}`);
  expect(a).toBe(b);
  expect(useAuthStore.getState().tokens?.refresh.raw).toBe(newRefresh);
});

test("a failed refresh clears the tokens", async () => {
  globalThis.fetch = (async () => new Response(null, { status: 401 })) as never;
  useAuthStore
    .getState()
    .setTokens({ access: access(5), refresh: validRefresh });
  expect(await getAccessToken()).toBeUndefined();
  expect(useAuthStore.getState().tokens).toBeUndefined();
});

test("setTokens stores the decoded payload and clear removes it", () => {
  const token = access(300);
  useAuthStore.getState().setTokens({ access: token, refresh: validRefresh });
  expect(useAuthStore.getState().tokens?.access.payload.typ).toBe("access");
  expect(useAuthStore.getState().tokens?.refresh.payload.typ).toBe("refresh");
  useAuthStore.getState().clear();
  expect(useAuthStore.getState().tokens).toBeUndefined();
});

test("an expiring access token with an expired refresh token logs out without refreshing", async () => {
  useAuthStore
    .getState()
    .setTokens({ access: access(5), refresh: refreshToken(5) });
  expect(await getAccessToken()).toBeUndefined();
  expect(calls).toHaveLength(0);
  expect(useAuthStore.getState().tokens).toBeUndefined();
});

const unauthorized = () =>
  Response.json(
    {
      defined: false,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    },
    { status: 401 },
  );

test("a 401 on a protected call logs out", async () => {
  globalThis.fetch = (async () => unauthorized()) as never;
  useAuthStore
    .getState()
    .setTokens({ access: access(300), refresh: validRefresh });
  await orpc.tags.remove({ id: 1 }).catch(() => {});
  expect(useAuthStore.getState().tokens).toBeUndefined();
});
