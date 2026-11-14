import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { contract } from "@woj/contract";
import type { Config } from "./config";

export function getOrpcLink(config: Config) {
  return new OpenAPILink(contract, {
    origin: config.apiUrl,
    headers: config.apiKey ? { "x-api-key": config.apiKey } : {},
  });
}

export function getOrpc(config: Config): RouterContractClient<typeof contract> {
  const link = getOrpcLink(config);

  return createORPCClient(link);
}
