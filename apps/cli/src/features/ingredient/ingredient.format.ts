import type { Ingredient } from "@woj/contract";
import { mdFormatter } from "../../lib/format";

export const ingredientFormatter = mdFormatter(
  (ingredient: Ingredient) => `# ${ingredient.title}

- **id**: ${ingredient.id}
- **calories**: ${ingredient.calories}
- **default unit**: ${ingredient.defaultUnit.title}
${ingredient.conversions
  .map((c) => `- 1 ${c.unit.title} = ${c.factor}`)
  .join("\n")}
`,
);
