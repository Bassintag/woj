import { meals as mealsTable } from "@woj/db";
import { eq } from "drizzle-orm";
import type { Tx } from "../../lib/db";

export async function replaceMeals(
  tx: Tx,
  menuId: number,
  meals: { recipeId: number; quantity: number }[],
) {
  await tx.delete(mealsTable).where(eq(mealsTable.menuId, menuId));
  if (meals.length > 0) {
    await tx
      .insert(mealsTable)
      .values(meals.map((m, order) => ({ ...m, order, menuId })));
  }
}
