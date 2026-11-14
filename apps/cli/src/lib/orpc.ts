import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { contract } from "@woj/contract";
import type { Config } from "./config";

export function getOrpc(config: Config): RouterContractClient<typeof contract> {
  const link = new OpenAPILink(contract, {
    origin: config.apiUrl,
    headers: config.apiKey ? { "x-api-key": config.apiKey } : {},
  });

  return createORPCClient(link);
}
