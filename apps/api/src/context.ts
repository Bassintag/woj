import { createDb } from "./lib/db";
import { createEnv } from "./lib/env";
import { createRecipeContext } from "./recipes/recipe.context";

export function createBaseContext() {
  const env = createEnv();
  const db = createDb(env);

  return {
    env,
    db,
  };
}

export type BaseContext = ReturnType<typeof createBaseContext>;

export function createContext() {
  const context = createBaseContext();

  return {
    ...context,
    recipe: createRecipeContext(context),
  };
}

export type Context = ReturnType<typeof createContext>;
