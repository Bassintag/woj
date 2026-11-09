import { expect, test } from "bun:test";
import { CreateRecipeSchema, RecipeDetailSchema, RecipeSchema } from "./recipe";

const tag = { id: 1, title: "Vegan" };

const detail = {
  id: 1,
  title: "Soupe",
  imageUrl: null,
  calories: null,
  bakingTime: null,
  cookingTime: 10,
  constituents: [],
  steps: [{ id: 1, description: "Mélanger" }],
  tags: [tag],
};

test("RecipeSchema accepts nullable image and calories", () => {
  const recipe = RecipeSchema.parse({ ...detail, tags: [{ id: 1 }] });
  expect(recipe.imageUrl).toBeNull();
  expect(recipe.calories).toBeNull();
});

test("RecipeSchema rejects a missing title", () => {
  const { title, ...rest } = detail;
  expect(RecipeSchema.safeParse(rest).success).toBe(false);
});

test("RecipeDetailSchema requires full tags", () => {
  expect(RecipeDetailSchema.safeParse(detail).success).toBe(true);
  expect(
    RecipeDetailSchema.safeParse({ ...detail, tags: [{ id: 1 }] }).success,
  ).toBe(false);
});

test("CreateRecipeSchema strips id and calories", () => {
  const parsed = CreateRecipeSchema.parse(detail);
  expect(parsed).not.toHaveProperty("id");
  expect(parsed).not.toHaveProperty("calories");
});
