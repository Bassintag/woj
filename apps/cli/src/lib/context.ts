import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { contract } from "@woj/contract";

export interface ContextOptions {
  url: string;
  apiKey?: string | undefined;
}

export function createContext({ url, apiKey }: ContextOptions) {
  const link = new OpenAPILink(contract, {
    origin: url,
    headers: apiKey ? { "x-api-key": apiKey } : {},
  });
  const client: RouterContractClient<typeof contract> = createORPCClient(link);
  return { client };
}

export type Context = ReturnType<typeof createContext>;
