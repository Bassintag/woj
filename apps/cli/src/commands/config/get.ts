import { defineCommand } from "citty";
import { configArgs, getConfig } from "../../lib/config";
import { runCommand } from "../../lib/error";

export const configGetCommand = defineCommand({
  meta: {
    description: "Print a resolved configuration value",
  },
  args: configArgs({
    key: {
      type: "positional",
      required: true,
      description: "Configuration key, e.g. apiUrl",
    },
  }),
  run({ args }) {
    return runCommand(async () => {
      const config = await getConfig(args);
      const value = config[args.key as keyof typeof config];
      if (value == null)
        throw new Error(`Unknown configuration key: ${args.key}`);
      console.log(String(value));
    });
  },
});
