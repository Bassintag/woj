import { defineCommand } from "citty";
import { searchCommand } from "./recipe/search";

export const recipeCommand = defineCommand({
  subCommands: {
    search: searchCommand,
  },
});
