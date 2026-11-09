import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { PinoHandlerPlugin } from "@orpc/pino";
import { CORSHandlerPlugin } from "@orpc/server/plugins";
import type { Context } from "./context";
import { router } from "./router";

export function createApp(context: Context) {
  const handler = new OpenAPIHandler(router, {
    plugins: [
      new PinoHandlerPlugin({ logger: context.log }),
      new CORSHandlerPlugin({}),
    ],
  });

  return async function fetch(request: Request) {
    const { matched, response } = await handler.handle(request, {
      context: { ...context, request },
    });
    if (!matched) return Response.json({ error: "Not found" });
    return response;
  };
}
