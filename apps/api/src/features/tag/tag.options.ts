import type { QueryOptions } from "../../lib/db";

export const tagOptions = {
  columns: {
    id: true,
    title: true,
    color: true,
  },
} satisfies QueryOptions<"tags">;
