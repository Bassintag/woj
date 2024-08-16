import { Unit } from "@/features/recipe/domain/Recipe";

export const formatWithUnit = (unit: Unit, value: number) => {
  const symbol = unit.symbols.find(({ min, max }) => {
    return !(min != null && min > value) && !(max != null && max < value);
  });
  if (symbol == null) return value.toFixed(2);
  let scaled = value * symbol.factor;
  if (symbol.digits === 0) {
    scaled = Math.ceil(scaled);
  }
  const format = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: symbol.digits,
  });
  return `${format.format(scaled)} ${symbol.name}`.trimEnd();
};
