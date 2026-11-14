import { defineCommand } from "citty";
import { configArgs, getConfig } from "../../lib/config";
import { runCommand } from "../../lib/error";

export const configListCommand = defineCommand({
  meta: {
    description: "List the resolved configuration values",
  },
  args: configArgs(),
  run({ args }) {
    return runCommand(async () => {
      const config = await getConfig(args);
      for (const [key, value] of Object.entries(config)) {
        if (value == null) continue;
        console.log(`${key}=${value}`);
      }
    });
  },
});
