import { LibsqlError } from "@libsql/client";
import { ORPCError } from "@orpc/server";
import { relations } from "@woj/db";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type { Env } from "./env";

export function createDb(env: Env) {
  return drizzle(env.DB_FILE_PATH, { relations });
}

export type Db = ReturnType<typeof createDb>;

export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export type QueryOptions<T extends keyof Db["query"]> = Parameters<
  Db["query"][T]["findFirst"]
>[0];

export async function orThrow<T>(promise: Promise<T>) {
  const value = await promise;
  if (value == null) throw new ORPCError("NOT_FOUND");
  return value;
}

export async function firstOrThrow<T>(promise: Promise<T[]>) {
  const values = await promise;
  if (values[0] == null) throw new ORPCError("NOT_FOUND");
  return values[0];
}

export function isConstraintError(error: unknown) {
  for (let e = error; e instanceof Error; e = e.cause) {
    if (
      e instanceof LibsqlError &&
      (e.extendedCode === "SQLITE_CONSTRAINT_UNIQUE" ||
        e.extendedCode === "SQLITE_CONSTRAINT_FOREIGNKEY")
    ) {
      return true;
    }
  }
  return false;
}

export function query<T extends Record<string, unknown> = never, R = never>(
  build: (params: T) => {
    prepare(): { execute(params?: Record<string, unknown>): Promise<R> };
  },
) {
  const params = new Proxy(
    {},
    { get: (_, key) => sql.placeholder(String(key)) },
  ) as T;
  const prepared = build(params).prepare();
  return function execute(...values: [T] extends [never] ? [] : [T]) {
    return prepared.execute(values[0]);
  };
}
