import { describe, expect, test } from "bun:test";
import { LibsqlError } from "@libsql/client";
import { call } from "@orpc/server";
import type { RequestContext } from "../context";
import { orpc, scope } from "./orpc";

const env = {
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "pa:ss",
  API_KEY: "secret-key",
};

const protectedProcedure = orpc.tags.remove.handler(() => undefined);
const publicProcedure = orpc.tags.list.handler(() => []);

function run(
  procedure: typeof protectedProcedure | typeof publicProcedure,
  headers: Record<string, string> = {},
  contextEnv: Partial<typeof env> = env,
) {
  const context = {
    env: contextEnv,
    request: new Request("http://localhost", { headers }),
  } as unknown as RequestContext;
  return call(procedure as never, { id: 1 } as never, { context });
}

function basic(username: string, password: string) {
  return { authorization: `Basic ${btoa(`${username}:${password}`)}` };
}

async function expectUnauthorized(promise: Promise<unknown>) {
  const error = await promise.then(
    () => null,
    (e) => e,
  );
  expect(error?.code).toBe("UNAUTHORIZED");
}

describe("public procedures", () => {
  test("do not require credentials", async () => {
    await run(publicProcedure);
  });
});

describe("protected procedures", () => {
  test("reject requests without credentials", async () => {
    await expectUnauthorized(run(protectedProcedure));
  });

  test("accept valid basic credentials", async () => {
    await run(protectedProcedure, basic("admin", "pa:ss"));
  });

  test("reject a wrong password or username", async () => {
    await expectUnauthorized(run(protectedProcedure, basic("admin", "nope")));
    await expectUnauthorized(run(protectedProcedure, basic("root", "pa:ss")));
  });

  test("reject malformed authorization headers", async () => {
    for (const authorization of [
      "Basic",
      "Basic a b",
      `Bearer ${btoa("admin:pa:ss")}`,
      `Basic ${btoa("adminpa:ss".replace(":", ""))}`,
    ]) {
      await expectUnauthorized(run(protectedProcedure, { authorization }));
    }
  });

  test("accept a valid api key", async () => {
    await run(protectedProcedure, { "x-api-key": "secret-key" });
  });

  test("reject a wrong api key", async () => {
    await expectUnauthorized(run(protectedProcedure, { "x-api-key": "nope" }));
  });

  test("reject everything when env credentials are not configured", async () => {
    await expectUnauthorized(
      run(protectedProcedure, basic("admin", "pa:ss"), {}),
    );
    await expectUnauthorized(
      run(protectedProcedure, { "x-api-key": "secret-key" }, {}),
    );
  });
});

describe("scope", () => {
  function inject(middleware: ReturnType<typeof scope>, db: object) {
    let received: { queries: unknown } | undefined;
    const next = (options: { context: { queries: unknown } }) => {
      received = options.context;
    };
    middleware({ context: { db }, next } as never);
    return received?.queries;
  }

  test("injects the factory result as context.queries", () => {
    const queries = { list: () => [] };
    expect(inject(scope(() => queries) as never, {})).toBe(queries);
  });

  test("calls the factory once per db", () => {
    let calls = 0;
    const middleware = scope(() => ({ id: ++calls })) as never;
    const db = {};
    const first = inject(middleware, db);
    expect(inject(middleware, db)).toBe(first);
    expect(calls).toBe(1);
  });

  test("calls the factory again for a different db", () => {
    let calls = 0;
    const middleware = scope(() => ++calls) as never;
    expect(inject(middleware, {})).toBe(1);
    expect(inject(middleware, {})).toBe(2);
  });

  test("exposes queries to handlers of the scoped router", async () => {
    const scoped = orpc.tags.use(scope(() => ({ answer: 42 })));
    const procedure = scoped.list.handler(({ context }) => {
      return [{ id: context.queries.answer, title: "" }];
    });
    const context = {
      db: {},
      env,
      request: new Request("http://localhost"),
    };
    const result = await call(
      procedure as never,
      undefined as never,
      {
        context,
      } as never,
    );
    expect(result).toEqual([{ id: 42, title: "" }]);
  });
});

describe("constraint errors", () => {
  test("are mapped to CONFLICT", async () => {
    const procedure = orpc.tags.list.handler(() => {
      throw new LibsqlError(
        "dup",
        "SQLITE_CONSTRAINT",
        "SQLITE_CONSTRAINT_UNIQUE",
      );
    });
    const error = await run(procedure as never).catch((e) => e);
    expect(error.code).toBe("CONFLICT");
  });
});
