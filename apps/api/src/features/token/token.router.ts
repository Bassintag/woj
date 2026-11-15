import { ORPCError } from "@orpc/server";
import type { AccessTokenPayload, RefreshTokenPayload } from "@woj/contract";
import { RefreshTokenSchema } from "@woj/contract";
import jwt from "jsonwebtoken";
import { orpc } from "../../lib/orpc";
import { parseAuthorization, verifyBasic, verifyToken } from "./token.lib";

const authenticated = orpc.tokens.use(({ context, next }) => {
  const authorization = parseAuthorization(
    context.request.headers.get("authorization"),
  );
  switch (authorization?.scheme) {
    case "Basic":
      verifyBasic(authorization.credentials, context.env);
      break;
    case "Bearer":
      verifyToken(
        authorization.credentials,
        context.env.JWT_SECRET,
        RefreshTokenSchema,
      );
      break;
    default:
      throw new ORPCError("UNAUTHORIZED");
  }
  return next();
});

const create = authenticated.create.handler(({ context }) => {
  const { JWT_SECRET: secret } = context.env;
  const access = jwt.sign(
    { typ: "access" } satisfies AccessTokenPayload,
    secret,
    { algorithm: "HS256", expiresIn: "5min" },
  );
  const refresh = jwt.sign(
    { typ: "refresh" } satisfies RefreshTokenPayload,
    secret,
    { algorithm: "HS256", expiresIn: "7days" },
  );
  return { access, refresh };
});

export const tokenRouter = authenticated.router({
  create,
});
