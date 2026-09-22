import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { PinoHandlerPlugin } from "@orpc/pino";
import { createContext } from "./context";
import { router } from "./router";

const context = createContext();

const pinoPlugin = new PinoHandlerPlugin({ logger: context.log });

const handler = new OpenAPIHandler(router, {
  plugins: [pinoPlugin],
});

const server = Bun.serve({
  async fetch(request) {
    const { matched, response } = await handler.handle(request, { context });
    if (!matched) return Response.json({ error: "Not found" });
    return response;
  },
});

context.log.info(`Server listening on port ${server.port}`);
