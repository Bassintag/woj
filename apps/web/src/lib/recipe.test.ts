import { expect, test } from "bun:test";
import { filterByTags } from "./recipe";

const recipes = new Map([
  [1, { tags: [{ id: 10 }] }],
  [2, { tags: [{ id: 20 }, { id: 30 }] }],
  [3, { tags: [] }],
]);

function get(id: number) {
  return recipes.get(id) as { tags: { id: number }[] };
}

const results = [{ id: 1 }, { id: 2 }, { id: 3 }];

test("keeps recipes matching any selected tag", () => {
  expect(filterByTags(results, [10, 30], get)).toEqual([{ id: 1 }, { id: 2 }]);
});

test("returns nothing when no tag matches", () => {
  expect(filterByTags(results, [99], get)).toEqual([]);
});

test("keeps the order of the results", () => {
  expect(filterByTags([{ id: 2 }, { id: 1 }], [10, 20], get)).toEqual([
    { id: 2 },
    { id: 1 },
  ]);
});
