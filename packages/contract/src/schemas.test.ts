import { expect, test } from "bun:test";
import {
  CreateRecipeSchema,
  RecipeDetailSchema,
  RecipeSchema,
  UpdateRecipeSchema,
} from "./recipe";
import { CreateUnitSchema, UpdateUnitSchema } from "./unit";

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

test("CreateRecipeSchema makes times optional", () => {
  const parsed = CreateRecipeSchema.parse({
    title: "Soupe",
    constituents: [{ ingredientId: 1, unitId: 1, quantity: 2 }],
    steps: [{ description: "Mélanger" }],
    tagIds: [],
  });
  expect(parsed.bakingTime).toBeUndefined();
});

test("CreateRecipeSchema rejects references to full objects", () => {
  expect(CreateRecipeSchema.safeParse(detail).success).toBe(false);
});

test("UpdateRecipeSchema requires at least one field", () => {
  expect(UpdateRecipeSchema.safeParse({ id: 1 }).success).toBe(false);
  expect(UpdateRecipeSchema.safeParse({ id: 1, tagIds: [] }).success).toBe(
    true,
  );
});

test("CreateUnitSchema requires symbols and positive factors", () => {
  const symbol = { title: "g", digits: 0, factor: 1 };
  expect(CreateUnitSchema.safeParse({ title: "Gramme" }).success).toBe(false);
  expect(
    CreateUnitSchema.safeParse({ title: "Gramme", symbols: [symbol] }).success,
  ).toBe(true);
  expect(
    CreateUnitSchema.safeParse({
      title: "Gramme",
      symbols: [{ ...symbol, factor: 0 }],
    }).success,
  ).toBe(false);
});

test("UpdateUnitSchema requires at least one field", () => {
  expect(UpdateUnitSchema.safeParse({ id: 1 }).success).toBe(false);
  expect(UpdateUnitSchema.safeParse({ id: 1, symbols: [] }).success).toBe(true);
});
