import { defineMeta } from "@orpc/contract";

type AuthMeta = boolean;

export const [auth, getAuthMeta] = defineMeta(
  "auth",
  (incoming: AuthMeta) => incoming,
);
