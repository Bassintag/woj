import type { Ingredient, RecipeDetail, Unit } from "@woj/contract";
import { formatQuantity } from "./quantity";

export interface ShoppingEntry {
  recipe: RecipeDetail;
  servings: number;
}

export interface ShoppingItem {
  label: string;
  image?: string;
}

interface Line {
  ingredient: Ingredient;
  unit: Unit;
  amount: number;
}

function toNatural({ ingredient, unit, amount }: Line): Line | undefined {
  if (unit.id === ingredient.defaultUnit.id) {
    return { ingredient, unit, amount };
  }
  const factor = ingredient.conversions.find(
    (c) => c.unit.id === unit.id,
  )?.factor;
  if (factor == null) return undefined;
  return { ingredient, unit: ingredient.defaultUnit, amount: amount * factor };
}

function sum(lines: Line[]) {
  const totals = new Map<number, Line>();
  for (const line of lines) {
    const total = totals.get(line.unit.id);
    if (total) total.amount += line.amount;
    else totals.set(line.unit.id, { ...line });
  }
  return [...totals.values()];
}

function merge(lines: Line[]) {
  const first = lines[0].unit.id;
  if (lines.every((line) => line.unit.id === first)) return sum(lines);
  const converted = lines.map(toNatural);
  return sum(converted.map((line, i) => line ?? lines[i]));
}

export function buildShoppingList(entries: ShoppingEntry[]): ShoppingItem[] {
  const groups = new Map<number, Line[]>();
  for (const { recipe, servings } of entries) {
    for (const { ingredient, unit, quantity } of recipe.constituents) {
      const lines = groups.get(ingredient.id) ?? [];
      lines.push({ ingredient, unit, amount: quantity * servings });
      groups.set(ingredient.id, lines);
    }
  }
  return [...groups.values()].flatMap((lines) =>
    merge(lines).map(({ ingredient, unit, amount }) => ({
      label: `${ingredient.title} - ${formatQuantity(amount, unit)}`,
      image: ingredient.imageUrl ?? undefined,
    })),
  );
}
