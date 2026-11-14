import { defineCommand } from "citty";
import { getConfig } from "../../lib/config";

export const configGetCommand = defineCommand({
  args: {
    key: {
      type: "positional",
      required: true,
    },
  },
  async run({ args }) {
    const config = await getConfig(args);
    const value = config[args.key as keyof typeof config];
    if (value != null) {
      console.log(String(value));
    }
  },
});
