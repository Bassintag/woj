import pino from "pino";
import { createIngredientContext } from "./features/ingredient/ingredient.context";
import { createMenuContext } from "./features/menu/menu.context";
import { createRecipeContext } from "./features/recipe/recipe.context";
import { createTagContext } from "./features/tag/tag.context";
import { createUnitContext } from "./features/unit/unit.context";
import { createDb } from "./lib/db";
import { createEnv } from "./lib/env";

export function createBaseContext() {
  const log = pino();
  const env = createEnv();
  const db = createDb(env);

  return {
    log,
    env,
    db,
  };
}

export type BaseContext = ReturnType<typeof createBaseContext>;

export function createContext() {
  const context = createBaseContext();

  return {
    ...context,
    ingredient: createIngredientContext(context),
    menu: createMenuContext(context),
    recipe: createRecipeContext(context),
    tag: createTagContext(context),
    unit: createUnitContext(context),
  };
}

export type Context = ReturnType<typeof createContext>;
