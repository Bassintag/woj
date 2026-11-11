import type { Menu } from "@woj/contract";
import { mdFormatter } from "../../lib/format";

export const menuFormatter = mdFormatter(
  (menu: Menu) => `# ${menu.title}

- **id**: ${menu.id}
${menu.meals.map((m) => `- ${m.quantity} × ${m.recipe.title}`).join("\n")}
`,
);
