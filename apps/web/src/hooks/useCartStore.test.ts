import { beforeEach, expect, test } from "bun:test";
import { useCartStore } from "./useCartStore";

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

function items() {
  return useCartStore.getState().items;
}

test("add creates a line for a new recipe", () => {
  const { add } = useCartStore.getState();
  add({ recipeId: 1, quantity: 2 });
  add({ recipeId: 2, quantity: 4 });
  expect(items()).toEqual([
    { recipeId: 1, quantity: 2 },
    { recipeId: 2, quantity: 4 },
  ]);
});

test("add sums the quantity of a recipe already in the cart", () => {
  const { add } = useCartStore.getState();
  add({ recipeId: 1, quantity: 2 });
  add({ recipeId: 2, quantity: 4 });
  add({ recipeId: 1, quantity: 3 });
  expect(items()).toEqual([
    { recipeId: 1, quantity: 5 },
    { recipeId: 2, quantity: 4 },
  ]);
});

test("setQuantity updates the line and never goes below 1", () => {
  const { add, setQuantity } = useCartStore.getState();
  add({ recipeId: 1, quantity: 2 });
  setQuantity(1, 6);
  expect(items()[0].quantity).toBe(6);
  setQuantity(1, 0);
  expect(items()[0].quantity).toBe(1);
});

test("remove deletes only the targeted recipe", () => {
  const { add, remove } = useCartStore.getState();
  add({ recipeId: 1, quantity: 2 });
  add({ recipeId: 2, quantity: 4 });
  remove(1);
  expect(items().map((i) => i.recipeId)).toEqual([2]);
});

test("clear empties the cart", () => {
  const { add, clear } = useCartStore.getState();
  add({ recipeId: 1, quantity: 2 });
  clear();
  expect(items()).toHaveLength(0);
});

test("unknown ids are ignored", () => {
  const { add, setQuantity, remove } = useCartStore.getState();
  add({ recipeId: 1, quantity: 2 });
  setQuantity(99, 5);
  remove(99);
  expect(items()).toEqual([{ recipeId: 1, quantity: 2 }]);
});
