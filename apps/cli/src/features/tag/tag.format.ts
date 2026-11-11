import type { Tag } from "@woj/contract";
import { mdFormatter } from "../../lib/format";

export const tagFormatter = mdFormatter(
  (tag: Tag) => `# ${tag.title}

- **id**: ${tag.id}
`,
);
