import { symbols } from "@woj/db";
import { eq } from "drizzle-orm";
import type { Tx } from "../../lib/db";

export async function replaceSymbols(
  tx: Tx,
  unitId: number,
  values: Omit<typeof symbols.$inferInsert, "id" | "unitId">[],
) {
  await tx.delete(symbols).where(eq(symbols.unitId, unitId));
  if (values.length > 0) {
    await tx.insert(symbols).values(values.map((s) => ({ ...s, unitId })));
  }
}
