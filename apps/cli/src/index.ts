#!/usr/bin/env bun

import { defineCommand, runMain } from "citty";
import { configCommand } from "./commands/config";
import { recipeCommand } from "./commands/recipe";

const main = defineCommand({
  meta: {
    name: "woj",
  },
  subCommands: {
    config: configCommand,
    recipe: recipeCommand,
  },
});

await runMain(main);
