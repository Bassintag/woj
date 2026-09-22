import { implement, ORPCError } from "@orpc/server";
import { contract, getAuthMeta } from "@woj/contract";
import type { Context } from "../context";

export const orpc = implement(contract)
  .$context<Context>()
  .use(({ procedure, next }) => {
    const auth = getAuthMeta(procedure);
    if (auth) {
      throw new ORPCError("NOT_IMPLEMENTED", {
        message: "Auth not implemented",
      });
    }
    return next();
  });
