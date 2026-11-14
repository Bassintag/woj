import { defineCommand } from "citty";
import { configArgs, getConfig } from "../../lib/config";
import { runCommand } from "../../lib/error";
import { formatImportResult } from "../../lib/jow/jow.format";
import { importJow } from "../../lib/jow/jow.import";
import { getOrpc } from "../../lib/orpc";

export const jowImportCommand = defineCommand({
  meta: {
    name: "import",
    description: "Import missing units, tags, ingredients and recipes",
  },
  args: configArgs(),
  run({ args }) {
    return runCommand(async () => {
      const config = await getConfig(args);
      const result = await importJow(getOrpc(config));
      console.log(formatImportResult(result));
    });
  },
});
