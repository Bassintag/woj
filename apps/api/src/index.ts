import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { PinoHandlerPlugin } from "@orpc/pino";
import { CORSHandlerPlugin } from "@orpc/server/plugins";
import { createContext } from "./context";
import { router } from "./router";

const context = createContext();

const pinoPlugin = new PinoHandlerPlugin({ logger: context.log });
const corsPlugin = new CORSHandlerPlugin({});

const handler = new OpenAPIHandler(router, {
  plugins: [pinoPlugin, corsPlugin],
});

const server = Bun.serve({
  async fetch(request) {
    const { matched, response } = await handler.handle(request, { context });
    if (!matched) return Response.json({ error: "Not found" });
    return response;
  },
});

context.log.info(`Server listening on port ${server.port}`);
