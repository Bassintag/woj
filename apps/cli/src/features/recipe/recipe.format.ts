import type { RecipeDetail, RecipeListItem } from "@woj/contract";
import type { MdFormatter } from "../../lib/format";

function time(label: string, value: number | null) {
  return value == null ? "" : `- **${label}**: ${value} min\n`;
}

export const recipeFormatter: MdFormatter<RecipeDetail, RecipeListItem> = {
  item: (recipe) => `# ${recipe.title}

- **id**: ${recipe.id}
- **calories**: ${recipe.calories ?? "-"}
${time("baking time", recipe.bakingTime)}${time("cooking time", recipe.cookingTime)}- **tags**: ${recipe.tags.map((t) => t.title).join(", ")}

## Ingredients

${recipe.constituents
  .map((c) => {
    const symbol = c.unit.symbols[0]?.title ?? c.unit.title;
    return `- ${c.quantity} ${symbol} ${c.ingredient.title}`;
  })
  .join("\n")}

## Steps

${recipe.steps.map((s, i) => `${i + 1}. ${s.description}`).join("\n")}
`,
  list: (recipes) =>
    recipes
      .map(
        (recipe) => `# ${recipe.title}

- **id**: ${recipe.id}
- **calories**: ${recipe.calories ?? "-"}
- **tags**: ${recipe.tagIds.join(", ")}
- **ingredients**: ${recipe.ingredients.join(", ")}
`,
      )
      .join("\n---\n\n"),
};
