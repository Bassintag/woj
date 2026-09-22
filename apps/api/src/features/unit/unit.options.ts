import type { QueryOptions } from "../../lib/db";

export const unitOptions = {
  columns: {
    id: true,
    title: true,
  },
  with: {
    symbols: {
      columns: {
        id: true,
        title: true,
        digits: true,
        factor: true,
        min: true,
        max: true,
      },
      orderBy: {
        factor: "asc",
      },
    },
  },
} satisfies QueryOptions<"units">;
