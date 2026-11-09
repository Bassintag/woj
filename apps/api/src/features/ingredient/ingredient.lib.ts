import { conversions } from "@woj/db";
import { eq } from "drizzle-orm";
import type { Tx } from "../../lib/db";

export async function replaceConversions(
  tx: Tx,
  ingredientId: number,
  values: { unitId: number; factor: number }[],
) {
  await tx
    .delete(conversions)
    .where(eq(conversions.ingredientId, ingredientId));
  if (values.length > 0) {
    await tx
      .insert(conversions)
      .values(values.map((c) => ({ ...c, ingredientId })));
  }
}
