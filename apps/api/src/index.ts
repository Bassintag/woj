import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { PinoHandlerPlugin } from "@orpc/pino";
import { CORSHandlerPlugin } from "@orpc/server/plugins";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createContext } from "./context";
import { router } from "./router";

const context = createContext();

await migrate(context.db, {
  migrationsFolder: context.env.MIGRATIONS_DIRECTORY,
});

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
