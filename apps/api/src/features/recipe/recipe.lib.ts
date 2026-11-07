const MAX_CALORIES_PER_100 = 900;
const MEASURED_UNITS = ["Kilogramme", "Litre"];

export interface CalorieConstituent {
  quantity: number;
  unit: { title: string };
  ingredient: {
    calories: number;
    defaultUnit: { title: string };
    conversions: { factor: number; unit: { title: string } }[];
  };
}

export function getConstituentCalories({
  quantity,
  unit,
  ingredient,
}: CalorieConstituent) {
  const natural = ingredient.defaultUnit.title;
  const factor =
    unit.title === natural
      ? 1
      : ingredient.conversions.find((c) => c.unit.title === unit.title)?.factor;
  if (factor == null) return 0;
  const amount = quantity * factor;
  if (!MEASURED_UNITS.includes(natural)) return ingredient.calories * amount;
  return Math.min(ingredient.calories, MAX_CALORIES_PER_100) * 10 * amount;
}

export function getRecipeCalories(constituents: CalorieConstituent[]) {
  return constituents.reduce((sum, c) => sum + getConstituentCalories(c), 0);
}
