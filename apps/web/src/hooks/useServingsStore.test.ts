import { beforeEach, expect, test } from "bun:test";
import { useServingsStore } from "./useServingsStore";

beforeEach(() => {
  useServingsStore.setState({ servings: 2 });
});

function servings() {
  return useServingsStore.getState().servings;
}

test("defaults to 2 servings", () => {
  expect(servings()).toBe(2);
});

test("set updates the servings", () => {
  useServingsStore.getState().set(4);
  expect(servings()).toBe(4);
});

test("set never goes below 1", () => {
  useServingsStore.getState().set(0);
  expect(servings()).toBe(1);
});
