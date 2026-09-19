import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { createContext } from "./context";
import { router } from "./router";

const handler = new OpenAPIHandler(router);

const context = createContext();

const server = Bun.serve({
  async fetch(request) {
    const { matched, response } = await handler.handle(request, { context });
    if (!matched) return Response.json({ error: "Not found" });
    return response;
  },
});

console.log(`Server listening on port ${server.port}`);
