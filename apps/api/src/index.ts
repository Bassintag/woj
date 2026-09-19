import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { router } from "./router";

const handler = new OpenAPIHandler(router);

const server = Bun.serve({
  async fetch(request) {
    const { matched, response } = await handler.handle(request, {});
    if (!matched) return Response.json({ error: "Not found" });
    return response;
  },
});

console.log(`Server listening on port ${server.port}`);
