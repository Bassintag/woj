import { expect, test } from "bun:test";
import type { Ingredient, RecipeDetail, Unit } from "@woj/contract";
import { buildShoppingList } from "./shoppingList";

function unit(id: number, title: string): Unit {
  return {
    id,
    title,
    symbols: [{ id, title, digits: 0, factor: 1, min: null, max: null }],
  };
}

const g = unit(1, "g");
const kg = unit(2, "kg");
const piece = unit(3, "");

const flour: Ingredient = {
  id: 1,
  title: "Farine",
  imageUrl: "flour.png",
  calories: 0,
  defaultUnit: g,
  conversions: [{ id: 1, factor: 1000, unit: kg }],
};

function recipe(
  ...constituents: { unit: Unit; quantity: number }[]
): RecipeDetail {
  return {
    constituents: constituents.map((c, id) => ({
      id,
      ingredient: flour,
      ...c,
    })),
  } as unknown as RecipeDetail;
}

test("multiplies quantities by servings", () => {
  const items = buildShoppingList([
    { recipe: recipe({ unit: g, quantity: 50 }), servings: 4 },
  ]);
  expect(items).toEqual([{ label: "Farine - 200 g", image: "flour.png" }]);
});

test("sums identical units across recipes", () => {
  const items = buildShoppingList([
    { recipe: recipe({ unit: g, quantity: 50 }), servings: 2 },
    { recipe: recipe({ unit: g, quantity: 100 }), servings: 1 },
  ]);
  expect(items.map((i) => i.label)).toEqual(["Farine - 200 g"]);
});

test("converts different units to the natural unit", () => {
  const items = buildShoppingList([
    { recipe: recipe({ unit: g, quantity: 500 }), servings: 1 },
    { recipe: recipe({ unit: kg, quantity: 1 }), servings: 1 },
  ]);
  expect(items.map((i) => i.label)).toEqual([
    `Farine - ${(1500).toLocaleString("fr-FR")} g`,
  ]);
});

test("keeps a separate line when no conversion exists", () => {
  const items = buildShoppingList([
    { recipe: recipe({ unit: g, quantity: 500 }), servings: 1 },
    { recipe: recipe({ unit: piece, quantity: 2 }), servings: 1 },
  ]);
  expect(items).toHaveLength(2);
});

test("keeps the recipe unit when all units are identical", () => {
  const items = buildShoppingList([
    { recipe: recipe({ unit: kg, quantity: 1 }), servings: 1 },
  ]);
  expect(items.map((i) => i.label)).toEqual(["Farine - 1 kg"]);
});
