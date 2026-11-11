import { z } from "zod";

export const FormatSchema = z.enum(["md", "json"]);

export type Format = z.infer<typeof FormatSchema>;

export interface MdFormatter<ItemT, ListItemT = ItemT> {
  item: (item: ItemT) => string;
  list: (items: ListItemT[]) => string;
}

export function mdFormatter<T>(item: (data: T) => string): MdFormatter<T> {
  return { item, list: (items) => items.map(item).join("\n\n---\n\n") };
}

export function render(
  data: unknown,
  format: Format,
  md: MdFormatter<never, never>,
) {
  if (format === "json") return JSON.stringify(data ?? null, null, 2);
  if (data == null) return;
  return Bun.markdown.ansi(
    Array.isArray(data) ? md.list(data as never) : md.item(data as never),
  );
}
