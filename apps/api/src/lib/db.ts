import { ORPCError } from "@orpc/server";
import { relations } from "@woj/db";
import { drizzle } from "drizzle-orm/libsql";
import type { Env } from "./env";

export function createDb(env: Env) {
  return drizzle(env.DB_FILE_PATH, { relations, logger: true });
}

export type Db = ReturnType<typeof createDb>;

export type QueryOptions<T extends keyof Db["query"]> = Parameters<
  Db["query"][T]["findFirst"]
>[0];

export async function orThrow<T>(promise: Promise<T>) {
  const value = await promise;
  if (value == null) throw new ORPCError("NOT_FOUND");
  return value;
}
