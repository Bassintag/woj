import { createHash, timingSafeEqual } from "node:crypto";
import { ORPCError } from "@orpc/server";
import jwt from "jsonwebtoken";
import type { z } from "zod";
import type { Env } from "../../lib/env";

export function safeEqual(a: string | undefined, b: string) {
  if (a === undefined) return false;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function parseAuthorization(header: string | null) {
  const [scheme, credentials, ...rest] = header?.split(" ") ?? [];
  if (!scheme || !credentials || rest.length > 0) return undefined;
  return { scheme, credentials };
}

export function verifyBasic(credentials: string, env: Env) {
  const decoded = Buffer.from(credentials, "base64").toString();
  const separator = decoded.indexOf(":");
  if (separator < 0) throw new ORPCError("UNAUTHORIZED");
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  if (
    !safeEqual(env.ADMIN_USERNAME, username) ||
    !safeEqual(env.ADMIN_PASSWORD, password)
  ) {
    throw new ORPCError("UNAUTHORIZED");
  }
}

export function verifyToken(token: string, secret: string, schema: z.ZodType) {
  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (schema.safeParse(payload).success) return;
  } catch {}
  throw new ORPCError("UNAUTHORIZED");
}
