import { mdFormatter } from "../../lib/format";
import type { ImportCount, ImportResult } from "./jow.import";

function line(label: string, { created, existing }: ImportCount) {
  return `- **${label}**: ${created} created, ${existing} existing`;
}

export const jowFormatter = mdFormatter(
  (result: ImportResult) => `# Import

${line("units", result.units)}
${line("tags", result.tags)}
${line("ingredients", result.ingredients)}
${line("recipes", result.recipes)}
${result.failures.length > 0 ? `\n## Failures\n\n${result.failures.map((f) => `- ${f}`).join("\n")}\n` : ""}`,
);
