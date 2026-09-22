import { createORPCClient } from "@orpc/client";
import {
  getProcedureContractOrThrow,
  type RouterContractClient,
} from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { contract, getAuthMeta } from "@woj/contract";

const link = new OpenAPILink(contract, {
  origin: "http://localhost:3000",
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
