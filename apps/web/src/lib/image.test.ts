import { beforeAll, expect, test } from "bun:test";
import { image } from "./image";

beforeAll(() => {
  import.meta.env.PUBLIC_IMAGES_URL = "https://images.test/";
});

test("image returns undefined without a path", () => {
  expect(image(undefined)).toBeUndefined();
  expect(image("")).toBeUndefined();
});

test("image resolves the path against the images url", () => {
  expect(image("recipes/1.webp")).toBe("https://images.test/recipes/1.webp");
});
