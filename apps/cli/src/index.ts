#!/usr/bin/env bun
import { parse, printErrors, printHelp, printVersion } from "@bomb.sh/router";
import { ORPCError } from "@orpc/client";
import { z } from "zod";
import { app, type ExecuteIntent } from "./app";
import { ingredientFormatter } from "./features/ingredient/ingredient.format";
import { jowFormatter } from "./features/jow/jow.format";
import { menuFormatter } from "./features/menu/menu.format";
import { recipeFormatter } from "./features/recipe/recipe.format";
import { tagFormatter } from "./features/tag/tag.format";
import { unitFormatter } from "./features/unit/unit.format";
import { createContext } from "./lib/context";
import { render } from "./lib/format";
import { handlerOf } from "./lib/handler";

const formatters = {
  ingredient: ingredientFormatter,
  jow: jowFormatter,
  menu: menuFormatter,
  recipe: recipeFormatter,
  tag: tagFormatter,
  unit: unitFormatter,
} as const;

async function execute(intent: ExecuteIntent) {
  if (intent.route === "/") return printHelp({ ...intent, method: "help" });
  const handler = handlerOf(intent.definition);
  if (!handler) throw new Error(`No handler for ${intent.route}`);
  const options = intent.models["/"];
  const data = await handler(intent.model as never, createContext(options));
  return render(data, options.format, formatters[intent.path[0]]);
}

export function fail(error: unknown): never {
  if (error instanceof z.ZodError) console.error(z.prettifyError(error));
  else if (error instanceof ORPCError)
    console.error(
      error.code === "UNAUTHORIZED"
        ? "Unauthorized: missing or invalid API key, use --api-key or WOJ_API_KEY"
        : `${error.code}: ${error.message}`,
    );
  else console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

export async function run(
  argv: string[],
  env: Record<string, string | undefined>,
) {
  const intent = parse(app, { argv, envs: [{ name: "process", value: env }] });

  if (!intent.ok) {
    console.error(printErrors(intent));
    process.exit(1);
  }

  switch (intent.method) {
    case "help":
      return printHelp(intent);
    case "version":
      return printVersion(intent);
    case "execute":
      return execute(intent);
  }
}

const output = await run(process.argv.slice(2), process.env).catch(fail);

if (output) console.log(output);
