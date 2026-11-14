#!/usr/bin/env bun

import { defineCommand, runMain } from "citty";
import { apiCommand } from "./commands/api";
import { configCommand } from "./commands/config";
import { jowCommand } from "./commands/jow";

const main = defineCommand({
  meta: {
    name: "woj",
    description: "Woj command line interface",
  },
  subCommands: {
    api: apiCommand,
    config: configCommand,
    jow: jowCommand,
  },
});

await runMain(main);
