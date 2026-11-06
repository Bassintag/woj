import { expect, test } from "bun:test";
import { image } from "./image";

test("image returns undefined without a path", () => {
  expect(image(undefined)).toBeUndefined();
  expect(image("")).toBeUndefined();
});

test("image resolves the path against the images route", () => {
  expect(image("recipes/1.webp")).toBe(
    "https://woj.test/images/recipes/1.webp",
  );
});
