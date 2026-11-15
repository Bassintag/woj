import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { auth } from "./lib/auth";

// Schemas
export const AccessTokenPayloadSchema = z.object({
  typ: z.literal("access"),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

export const RefreshTokenPayloadSchema = z.object({
  typ: z.literal("refresh"),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

export const TokenSchema = z.object({
  exp: z.number(),
});

export const AccessTokenSchema = TokenSchema.extend(
  AccessTokenPayloadSchema.shape,
);

export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const RefreshTokenSchema = TokenSchema.extend(
  RefreshTokenPayloadSchema.shape,
);

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const TokenPairSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export type TokenPair = z.infer<typeof TokenPairSchema>;

// Contract

const create = oc
  .meta(
    openapi({
      method: "POST",
      path: "/",
      summary: "Create a token",
    }),
  )
  .meta(auth(false))
  .output(TokenPairSchema);

export const tokenContract = oc
  .meta(openapi({ prefix: "/tokens", tags: ["Tokens"] }))
  .router({
    create,
  });
