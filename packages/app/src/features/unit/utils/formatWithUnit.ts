import { UnitDto } from "@woj/common/dto";

export const formatWithUnit = (unit: UnitDto, value: number) => {
  const symbol =
    unit.symbols.find(({ min, max }) => {
      return !(min != null && min >= value) && !(max != null && max < value);
    }) ?? unit.symbols[0];
  let scaled = value * symbol.factor;
  if (symbol.digits === 0) {
    scaled = Math.max(1, Math.round(scaled));
  }
  const format = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: symbol.digits,
  });
  return `${format.format(scaled)} ${symbol.name}`.trimEnd();
};
