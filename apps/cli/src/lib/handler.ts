import type { AnyRoute, ModelOf } from "@bomb.sh/router";
import type { Context } from "./context";

export type Handler = (model: never, context: Context) => unknown;

export function defineCommand<const CommandT extends AnyRoute>(
  definition: CommandT,
  run: (model: ModelOf<CommandT>, context: Context) => unknown,
): CommandT {
  return { ...definition, run };
}

export function handlerOf(definition: AnyRoute): Handler | null {
  const run = Reflect.get(definition, "run");
  return typeof run === "function" ? (run as Handler) : null;
}
