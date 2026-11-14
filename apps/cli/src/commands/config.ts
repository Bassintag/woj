import { defineCommand } from "citty";
import { configGetCommand } from "./config/get";
import { configListCommand } from "./config/list";

export const configCommand = defineCommand({
  meta: {
    description: "Read the CLI configuration",
  },
  subCommands: {
    list: configListCommand,
    get: configGetCommand,
  },
});
