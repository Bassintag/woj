import {
  command,
  description,
  env,
  type IntentsOf,
  name,
  option,
  schema,
  version,
} from "@bomb.sh/router";
import { z } from "zod";
import { ingredientRoute } from "./features/ingredient/ingredient.route";
import { jowRoute } from "./features/jow/jow.route";
import { menuRoute } from "./features/menu/menu.route";
import { recipeRoute } from "./features/recipe/recipe.route";
import { tagRoute } from "./features/tag/tag.route";
import { unitRoute } from "./features/unit/unit.route";
import { FormatSchema } from "./lib/format";

export const app = command(
  name("woj"),
  description("Woj command line"),
  version("0.1.0"),
  option(
    name("url"),
    env("WOJ_URL"),
    schema(z.url().default("http://localhost:3000")),
  ),
  option(name("apiKey"), env("WOJ_API_KEY"), schema(z.string().optional())),
  option(name("format"), schema(FormatSchema.default("json"))),
  ingredientRoute,
  jowRoute,
  menuRoute,
  recipeRoute,
  tagRoute,
  unitRoute,
);

export type ExecuteIntent<RouteT = string> = Extract<
  IntentsOf<typeof app>,
  { method: "execute"; route: RouteT }
>;
