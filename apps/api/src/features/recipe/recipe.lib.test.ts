import { expect, test } from "bun:test";
import { type CalorieConstituent, getRecipeCalories } from "./recipe.lib";

function constituent(
  quantity: number,
  unit: string,
  calories: number,
  natural: string,
  conversions: [string, number][] = [],
): CalorieConstituent {
  return {
    quantity,
    unit: { title: unit },
    ingredient: {
      calories,
      defaultUnit: { title: natural },
      conversions: conversions.map(([title, factor]) => ({
        factor,
        unit: { title },
      })),
    },
  };
}

test("kilograms use kcal per 100 g", () => {
  expect(
    getRecipeCalories([constituent(0.03, "Kilogramme", 368, "Kilogramme")]),
  ).toBeCloseTo(110.4);
});

test("litres use kcal per 100 ml", () => {
  expect(
    getRecipeCalories([constituent(0.2, "Litre", 46, "Litre")]),
  ).toBeCloseTo(92);
});

test("pieces use kcal per piece", () => {
  expect(getRecipeCalories([constituent(2, "Pièce", 87, "Pièce")])).toBe(174);
});

test("alternative units are converted to the natural unit", () => {
  const slices = constituent(2, "Tranche", 404, "Kilogramme", [
    ["Tranche", 0.02],
  ]);
  const cloves = constituent(4, "Gousse", 105, "Pièce", [["Gousse", 0.1]]);
  expect(getRecipeCalories([slices])).toBeCloseTo(161.6);
  expect(getRecipeCalories([cloves])).toBeCloseTo(42);
});

test("calories per 100 g are capped at 900", () => {
  expect(
    getRecipeCalories([constituent(0.1, "Litre", 2011, "Litre")]),
  ).toBeCloseTo(900);
});

test("lines without a conversion are ignored", () => {
  expect(
    getRecipeCalories([
      constituent(1, "Cup", 100, "Kilogramme"),
      constituent(1, "Pièce", 50, "Pièce"),
    ]),
  ).toBe(50);
});
