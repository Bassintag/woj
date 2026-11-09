import { beforeEach, expect, test } from "bun:test";
import { useFavoritesStore } from "./useFavoritesStore";

beforeEach(() => {
  useFavoritesStore.setState({ ids: [] });
});

function ids() {
  return useFavoritesStore.getState().ids;
}

test("starts empty", () => {
  expect(ids()).toEqual([]);
});

test("toggle adds a recipe", () => {
  useFavoritesStore.getState().toggle(1);
  expect(ids()).toEqual([1]);
});

test("toggle removes an existing recipe", () => {
  useFavoritesStore.getState().toggle(1);
  useFavoritesStore.getState().toggle(2);
  useFavoritesStore.getState().toggle(1);
  expect(ids()).toEqual([2]);
});
