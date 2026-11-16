import { afterEach, beforeEach, mock } from "bun:test";

export const navigate = mock(async () => {});

mock.module("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

const realFetch = globalThis.fetch;
const routes = new Map<string, ReturnType<typeof mock>>();

export function route(key: string, result?: unknown) {
  const handler = mock(async (_body: unknown, _request: Request) => result);
  routes.set(key, handler);
  return handler;
}

export function installFakeApi() {
  beforeEach(() => {
    routes.clear();
    navigate.mockClear();
    globalThis.fetch = (async (input: string, init: RequestInit) => {
      const request = new Request(input, init);
      const path = new URL(request.url).pathname
        .replace(/^\/api/, "")
        .replace(/(.)\/$/, "$1");
      const handler = routes.get(`${request.method} ${path}`);
      if (!handler) {
        return Response.json({ code: "NOT_FOUND" }, { status: 404 });
      }
      const type = request.headers.get("content-type") ?? "";
      let body: unknown;
      if (type.includes("json")) body = await request.json();
      else if (type.includes("multipart")) body = await request.formData();
      const result = await handler(body, request);
      if (result === undefined) return new Response(null, { status: 204 });
      return Response.json(result);
    }) as never;
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
  });
}
