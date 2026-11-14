import { defineCommand } from "citty";
import { getConfig } from "../../lib/config";
import { getOrpc } from "../../lib/orpc";

export const searchCommand = defineCommand({
  meta: {
    name: "search",
  },
  args: {
    query: {
      type: "positional",
      required: true,
    },
  },
  async run({ args }) {
    const config = await getConfig(args);
    const orpc = getOrpc(config);
    const recipes = await orpc.recipes.list();
    console.log(recipes.at(0));
  },
});
