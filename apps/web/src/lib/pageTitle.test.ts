import { expect, test } from "bun:test";
import { pageTitle } from "./pageTitle";

test("pageTitle appends the app name", () => {
  expect(pageTitle("Favoris")).toBe("Favoris · WOJ");
});

test("pageTitle returns the app name without a title", () => {
  expect(pageTitle()).toBe("WOJ");
});
