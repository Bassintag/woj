import type { Unit } from "@woj/contract";

export function formatQuantity(quantity: number, unit: Unit) {
  const symbol =
    unit.symbols.find(
      (s) =>
        (s.min == null || quantity >= s.min) &&
        (s.max == null || quantity < s.max),
    ) ?? unit.symbols[0];
  if (!symbol) return String(quantity);
  const value = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: symbol.digits,
  }).format(quantity / symbol.factor);
  return `${value} ${symbol.title}`.trim();
}
