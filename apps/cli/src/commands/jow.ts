import { defineCommand } from "citty";
import { jowImportCommand } from "./jow/import";

export const jowCommand = defineCommand({
  meta: {
    description: "Jow integration",
  },
  subCommands: {
    import: jowImportCommand,
  },
});
