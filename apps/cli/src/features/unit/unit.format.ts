import type { Unit } from "@woj/contract";
import { mdFormatter } from "../../lib/format";

export const unitFormatter = mdFormatter(
  (unit: Unit) => `# ${unit.title}

- **id**: ${unit.id}
${unit.symbols
  .map((s) => {
    const range = [s.min, s.max].some((v) => v != null)
      ? `, range ${s.min ?? "-∞"}..${s.max ?? "∞"}`
      : "";
    return `- \`${s.title}\` (factor ${s.factor}, ${s.digits} digits${range})`;
  })
  .join("\n")}
`,
);
