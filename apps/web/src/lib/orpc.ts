import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { contract } from "@woj/contract";

const link = new OpenAPILink(contract, {
  origin: `${window.location.origin}/api`,
});

export const orpc: RouterContractClient<typeof contract> =
  createORPCClient(link);

export const q = createTanstackQueryUtils(orpc);
