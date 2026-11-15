import { createORPCClient, ORPCError, onError } from "@orpc/client";
import {
  getProcedureContractOrThrow,
  type RouterContractClient,
} from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { contract, getAuthMeta } from "@woj/contract";
import { getAccessToken, logout } from "./auth";

interface ClientContext {
  authorization?: string;
}

const link = new OpenAPILink<ClientContext>(contract, {
  origin: `${window.location.origin}/api`,
  async fetch(url, init, { context }, path) {
    let authorization: string | undefined;
    if (context.authorization) {
      authorization = context.authorization;
    } else if (
      getAuthMeta(getProcedureContractOrThrow(contract, path)) !== false
    ) {
      const token = await getAccessToken();
      if (token) authorization = `Bearer ${token}`;
    }
    if (authorization) {
      init.headers = new Headers(init.headers);
      init.headers.set("authorization", authorization);
    }
    return fetch(url, init);
  },
  interceptors: [
    onError((error) => {
      if (error instanceof ORPCError && error.code === "UNAUTHORIZED") {
        logout();
      }
    }),
  ],
});

export const orpc: RouterContractClient<typeof contract, ClientContext> =
  createORPCClient(link);

export const q = createTanstackQueryUtils(orpc);
