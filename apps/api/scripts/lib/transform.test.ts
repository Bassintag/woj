import { expect, test } from "bun:test";
import type { Ingredient, Recipe } from "@woj/jow";
import {
  batch,
  getCalories,
  getConversions,
  getJowCalories,
  getQuantity,
  getTags,
  getUnit,
  getUnits,
  idByTitle,
} from "./transform";

function unit(name: string) {
  return { id: name, name, abbreviations: [] };
}

function ingredient(
  id: string,
  options: { facts?: { id: string; amount: number }[]; recipes?: unknown[] },
) {
  return {
    id,
    name: id,
    naturalUnit: unit("g"),
    editorialData: {
      nutritionalFacts: (options.facts ?? []).map((f) => ({
        ...f,
        label: f.id,
        unit: "kcal",
      })),
    },
    recipes: options.recipes ?? [],
  } as unknown as Ingredient;
}

test("batch splits rows into chunks and keeps the order", async () => {
  const sizes: number[] = [];
  const results = await batch(
    Array.from({ length: 250 }, (_, i) => i),
    async (rows) => {
      sizes.push(rows.length);
      return rows[0];
    },
  );
  expect(sizes).toEqual([100, 100, 50]);
  expect(results).toEqual([0, 100, 200]);
});

test("batch does nothing without rows", async () => {
  expect(await batch([], async () => 1)).toEqual([]);
});

test("idByTitle maps titles to ids", () => {
  const ids = idByTitle([
    { id: 1, title: "a" },
    { id: 2, title: "b" },
  ]);
  expect(ids.get("b")).toBe(2);
});

test("getCalories reads ENERC and defaults to 0", () => {
  const facts = [
    { id: "FAT", amount: 5 },
    { id: "ENERC", amount: 120 },
  ];
  expect(getCalories(ingredient("i", { facts }))).toBe(120);
  expect(getCalories(ingredient("i", { facts: [] }))).toBe(0);
});

test("getQuantity handles both constituent shapes", () => {
  const a = { quantityPerCover: 2, ingredient: { id: "i" } };
  const b = { ingredient: { id: "i", quantityPerCover: 3 } };
  expect(getQuantity(a as Recipe["constituents"][number])).toBe(2);
  expect(getQuantity(b as Recipe["constituents"][number])).toBe(3);
});

test("getUnit prefers the constituent unit over the natural unit", () => {
  const i = ingredient("i", {});
  const tranche = unit("Tranche");
  const withUnit = {
    unit: tranche,
  } as unknown as Recipe["constituents"][number];
  const without = {} as unknown as Recipe["constituents"][number];
  expect(getUnit(withUnit, i)).toBe(tranche);
  expect(getUnit(without, i)).toBe(i.naturalUnit);
});

test("getJowCalories reads the recipe ENERC fact", () => {
  const recipe = (nutritionalFacts?: { id: string; amount: number }[]) =>
    ({ nutritionalFacts }) as unknown as Recipe;
  expect(
    getJowCalories(
      recipe([
        { id: "FAT", amount: 15 },
        { id: "ENERC", amount: 422 },
      ]),
    ),
  ).toBe(422);
  expect(
    getJowCalories(recipe([{ id: "ENERC", amount: 200217 }])),
  ).toBeUndefined();
  expect(getJowCalories(recipe([]))).toBeUndefined();
  expect(getJowCalories(recipe())).toBeUndefined();
});

function withConversions(id: string, units: string[]) {
  const alternativeUnits = units.map((name) => ({
    id: `${id}-${name}`,
    unit: unit(name),
    quantity: 1,
  }));
  return ingredient(id, {
    recipes: [{ constituents: [{ ingredient: { id, alternativeUnits } }] }],
  });
}

test("getConversions deduplicates by ingredient and unit", () => {
  const a = withConversions("a", ["cl", "cl", "piece"]);
  const b = withConversions("b", ["cl"]);
  const conversions = getConversions([a, b]);
  expect(conversions.map((c) => `${c.ingredient.id}:${c.unit.name}`)).toEqual([
    "a:cl",
    "a:piece",
    "b:cl",
  ]);
});

test("getConversions ignores alternative units without id and other ingredients", () => {
  const other = ingredient("other", {
    recipes: [
      {
        constituents: [
          {
            ingredient: {
              id: "x",
              alternativeUnits: [{ id: "u", unit: unit("cl"), quantity: 1 }],
            },
          },
          {
            ingredient: {
              id: "other",
              alternativeUnits: [{ unit: unit("cl"), quantity: 1 }],
            },
          },
        ],
      },
    ],
  });
  expect(getConversions([other])).toEqual([]);
});

test("getUnits merges natural and conversion units without duplicates", () => {
  const a = withConversions("a", ["cl", "g"]);
  const units = getUnits([a], getConversions([a]));
  expect(units.map((u) => u.name)).toEqual(["g", "cl"]);
});

test("getTags keeps parent families and enabled diets without duplicates", () => {
  const recipe = {
    familyAncestors: [
      { name: "Veggie - grain" },
      { name: "Végétarien" },
      { name: "Plat" },
    ],
    eatingHabitsCompatibility: {
      porkless: true,
      vegetarian: true,
      vegan: false,
    },
  } as Recipe;
  expect(getTags(recipe)).toEqual(["Végétarien", "Plat", "Sans porc"]);
});

test("getTags keeps a root family and handles missing data", () => {
  expect(getTags({ familyAncestors: [{ name: "Soupe" }] } as Recipe)).toEqual([
    "Soupe",
  ]);
  expect(getTags({} as Recipe)).toEqual([]);
});
