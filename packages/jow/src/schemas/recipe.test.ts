import { expect, test } from "bun:test";
import { RecipeSchema } from "./recipe";

const base = {
  id: "r1",
  title: "Soupe",
  imageUrl: "a.jpg",
  directions: [{ id: "d1", label: "Mélanger" }],
  constituents: [],
};

const ingredient = { id: "i1" };

test("accepts constituents with quantityPerCover at the top level", () => {
  const recipe = RecipeSchema.parse({
    ...base,
    constituents: [{ quantityPerCover: 2, ingredient }],
  });
  expect(recipe.constituents[0]).toMatchObject({ quantityPerCover: 2 });
});

test("accepts constituents with quantityPerCover on the ingredient", () => {
  const recipe = RecipeSchema.parse({
    ...base,
    constituents: [{ ingredient: { ...ingredient, quantityPerCover: 3 } }],
  });
  expect(recipe.constituents).toHaveLength(1);
});

test("rejects constituents without any quantity", () => {
  expect(
    RecipeSchema.safeParse({ ...base, constituents: [{ ingredient }] }).success,
  ).toBe(false);
});

test("times are optional and nullable but must be integers", () => {
  expect(RecipeSchema.safeParse(base).success).toBe(true);
  expect(
    RecipeSchema.safeParse({
      ...base,
      preparationTime: null,
      cookingTime: null,
    }).success,
  ).toBe(true);
  expect(RecipeSchema.safeParse({ ...base, cookingTime: 1.5 }).success).toBe(
    false,
  );
});
