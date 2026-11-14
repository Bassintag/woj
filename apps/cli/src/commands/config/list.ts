import { defineCommand } from "citty";
import { getConfig } from "../../lib/config";

export const configListCommand = defineCommand({
  async run({ args }) {
    const config = await getConfig(args);
    for (const [key, value] of Object.entries(config)) {
      if (value == null) continue;
      console.log(`${key}=${value}`);
    }
  },
});
