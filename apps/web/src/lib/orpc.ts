import { createORPCClient } from "@orpc/client";
import {
  getProcedureContractOrThrow,
  type RouterContractClient,
} from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { contract, getAuthMeta } from "@woj/contract";

const link = new OpenAPILink(contract, {
  origin: import.meta.env.PUBLIC_API_URL,
  headers(_, path) {
    const procedure = getProcedureContractOrThrow(contract, path);
    const auth = getAuthMeta(procedure);
    const headers = new Headers();
    if (auth) {
      headers.set("Authorization", "TODO");
    }
    return headers;
  },
});

export const orpc: RouterContractClient<typeof contract> =
  createORPCClient(link);

export const q = createTanstackQueryUtils(orpc);
