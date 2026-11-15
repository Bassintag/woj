import { implement, type MiddlewareNext, ORPCError } from "@orpc/server";
import { AccessTokenSchema, contract, getAuthMeta } from "@woj/contract";
import type { RequestContext } from "../context";
import {
  parseAuthorization,
  safeEqual,
  verifyToken,
} from "../features/token/token.lib";
import { type Db, isConstraintError } from "./db";
import type { Env } from "./env";

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
      const authorization = parseAuthorization(headers.get("authorization"));
      if (authorization?.scheme === "Bearer") {
        verifyToken(
          authorization.credentials,
          context.env.JWT_SECRET,
          AccessTokenSchema,
        );
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
