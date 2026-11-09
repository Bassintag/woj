import { createHash, timingSafeEqual } from "node:crypto";
import { implement, type MiddlewareNext, ORPCError } from "@orpc/server";
import { contract, getAuthMeta } from "@woj/contract";
import type { RequestContext } from "../context";
import { type Db, isConstraintError } from "./db";
import type { Env } from "./env";

function safeEqual(a: string | undefined, b: string) {
  if (a === undefined) return false;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}

function basicAuth(header: string, env: Env) {
  const parts = header.split(" ");
  if (parts.length !== 2) throw new ORPCError("UNAUTHORIZED");
  const [scheme, encoded = ""] = parts;
  if (scheme !== "Basic") throw new ORPCError("UNAUTHORIZED");
  const credentials = Buffer.from(encoded, "base64").toString();
  const separator = credentials.indexOf(":");
  if (separator < 0) throw new ORPCError("UNAUTHORIZED");
  const username = credentials.slice(0, separator);
  const password = credentials.slice(separator + 1);
  if (
    !safeEqual(env.ADMIN_USERNAME, username) ||
    !safeEqual(env.ADMIN_PASSWORD, password)
  ) {
    throw new ORPCError("UNAUTHORIZED");
  }
}

function apiKeyAuth(header: string, env: Env) {
  if (!safeEqual(env.API_KEY, header)) throw new ORPCError("UNAUTHORIZED");
}

export const orpc = implement(contract)
  .$context<RequestContext>()
  .use(async ({ next }) => {
    try {
      return await next();
    } catch (error) {
      if (isConstraintError(error)) throw new ORPCError("CONFLICT");
      throw error;
    }
  })
  .use(({ context, procedure, next }) => {
    if (getAuthMeta(procedure) !== false) {
      const headers = context.request.headers;
      const authorizationHeader = headers.get("authorization");
      if (authorizationHeader) {
        basicAuth(authorizationHeader, context.env);
        return next();
      }
      const apiKeyHeader = headers.get("x-api-key");
      if (apiKeyHeader) {
        apiKeyAuth(apiKeyHeader, context.env);
        return next();
      }
      throw new ORPCError("UNAUTHORIZED");
    }
    return next();
  });

export function scope<T>(factory: (db: Db) => T) {
  const cache = new WeakMap<Db, T>();
  return function middleware({
    context,
    next,
  }: {
    context: { db: Db };
    next: MiddlewareNext<unknown>;
  }) {
    let queries = cache.get(context.db);
    if (!queries) {
      queries = factory(context.db);
      cache.set(context.db, queries);
    }
    return next({ context: { queries } });
  };
}
