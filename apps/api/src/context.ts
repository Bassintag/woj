import pino from "pino";
import { createDb } from "./lib/db";
import { createEnv } from "./lib/env";

export function createContext() {
  const log = pino();
  const env = createEnv();
  const db = createDb(env);

  return { log, env, db };
}

export type Context = ReturnType<typeof createContext>;

export type RequestContext = Context & { request: Request };
