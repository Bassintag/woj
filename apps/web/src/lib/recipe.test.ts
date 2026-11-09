import { expect, test } from "bun:test";
import { createRecipeIndex, filterByTags } from "./recipe";

const recipes = new Map([
  [1, { tags: [{ id: 10 }] }],
  [2, { tags: [{ id: 20 }, { id: 30 }] }],
  [3, { tags: [] }],
]);

function get(id: number) {
  return recipes.get(id) as { tags: { id: number }[] };
}

const results = [{ id: 1 }, { id: 2 }, { id: 3 }];

test("keeps recipes matching every selected tag", () => {
  expect(filterByTags(results, [20, 30], get)).toEqual([{ id: 2 }]);
  expect(filterByTags(results, [10, 30], get)).toEqual([]);
});

test("keeps every recipe without selected tags", () => {
  expect(filterByTags(results, [], get)).toEqual(results);
});

test("returns nothing when no tag matches", () => {
  expect(filterByTags(results, [99], get)).toEqual([]);
});

test("keeps the order of the results", () => {
  expect(filterByTags([{ id: 3 }, { id: 2 }, { id: 1 }], [], get)).toEqual([
    { id: 3 },
    { id: 2 },
    { id: 1 },
  ]);
});

function item(id: number, title: string, ingredients: string[]) {
  return {
    id,
    title,
    imageUrl: null,
    calories: null,
    tags: [],
    constituents: ingredients.map((title) => ({ ingredient: { title } })),
  };
}

const index = createRecipeIndex([
  item(1, "Salade", ["poulet", "tomate"]),
  item(2, "Poulet rôti", ["thym"]),
]);

test("finds recipes by ingredient", () => {
  expect(index.search("tomate").map((r) => r.id)).toEqual([1]);
});

test("ranks title matches before ingredient matches", () => {
  expect(index.search("poulet").map((r) => r.id)).toEqual([2, 1]);
});
