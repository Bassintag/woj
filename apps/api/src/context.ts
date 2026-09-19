import { createDb } from "./lib/db";
import { createEnv } from "./lib/env";

export function createContext() {
  const env = createEnv();
  const db = createDb();

  return {
    env,
    db,
  };
}

export type Context = ReturnType<typeof createContext>;
