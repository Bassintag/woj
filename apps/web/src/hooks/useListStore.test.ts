import { beforeEach, expect, test } from "bun:test";
import { useListStore } from "./useListStore";

beforeEach(() => {
  useListStore.setState({ items: [] });
});

function items() {
  return useListStore.getState().items;
}

test("add creates an unchecked item with a unique id", () => {
  const { add } = useListStore.getState();
  add("Café");
  add("Thé");
  expect(items()).toHaveLength(2);
  expect(items()[0]).toMatchObject({ label: "Café", checked: false });
  expect(items()[0].id).not.toBe(items()[1].id);
});

test("toggle flips only the targeted item", () => {
  const { add, toggle } = useListStore.getState();
  add("Café");
  add("Thé");
  toggle(items()[0].id);
  expect(items().map((i) => i.checked)).toEqual([true, false]);
  toggle(items()[0].id);
  expect(items()[0].checked).toBe(false);
});

test("update changes the label", () => {
  const { add, update } = useListStore.getState();
  add("Café");
  update(items()[0].id, "Thé");
  expect(items()[0].label).toBe("Thé");
});

test("update with an empty label removes the item", () => {
  const { add, update } = useListStore.getState();
  add("Café");
  update(items()[0].id, "");
  expect(items()).toHaveLength(0);
});

test("remove deletes only the targeted item", () => {
  const { add, remove } = useListStore.getState();
  add("Café");
  add("Thé");
  remove(items()[0].id);
  expect(items().map((i) => i.label)).toEqual(["Thé"]);
});

test("move reorders items and keeps checked ones in place", () => {
  const { add, toggle, move } = useListStore.getState();
  add("A");
  add("B");
  add("C");
  add("D");
  toggle(items()[1].id);
  move(items()[0].id, items()[2].id);
  expect(items().map((i) => i.label)).toEqual(["B", "C", "A", "D"]);
  expect(items()[0].checked).toBe(true);
  move(items()[3].id, items()[1].id);
  expect(items().map((i) => i.label)).toEqual(["B", "D", "C", "A"]);
});

test("move ignores unknown ids", () => {
  const { add, move } = useListStore.getState();
  add("A");
  add("B");
  move("nope", items()[0].id);
  move(items()[0].id, "nope");
  expect(items().map((i) => i.label)).toEqual(["A", "B"]);
});

test("unknown ids are ignored", () => {
  const { add, toggle, update, remove } = useListStore.getState();
  add("Café");
  toggle("nope");
  update("nope", "Thé");
  remove("nope");
  expect(items()).toHaveLength(1);
  expect(items()[0]).toMatchObject({ label: "Café", checked: false });
});
