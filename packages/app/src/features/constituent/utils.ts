import { ConstituentDto, UnitDto } from "@woj/common/dto";

export const getNormalizedQuantity = (
  constituent: Pick<ConstituentDto, "unit" | "ingredient" | "quantity">,
) => {
  if (constituent.unit.id === constituent.ingredient.defaultUnit.id) {
    return constituent.quantity;
  }
  const conversion = constituent.ingredient.conversions.find(
    (conversion) => conversion.unit.id === constituent.unit.id,
  );
  if (conversion == null) return constituent.quantity;
  return constituent.quantity * conversion.factor;
};

export const convertQuantity = (
  constituent: Pick<ConstituentDto, "unit" | "ingredient" | "quantity">,
  unit: UnitDto,
) => {
  if (constituent.unit.id === unit.id) {
    return constituent.quantity;
  }
  const normalized = getNormalizedQuantity(constituent);
  const conversion = constituent.ingredient.conversions.find(
    (conversion) => conversion.unit.id === unit.id,
  );
  if (conversion == null) return normalized;
  return normalized * conversion.factor;
};
