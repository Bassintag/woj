import { beforeEach, expect, test } from "bun:test";
import { useListStore } from "./useListStore";

beforeEach(() => {
  useListStore.setState({ items: [] });
});

test("add, toggle, update and remove", () => {
  const { add, toggle, update } = useListStore.getState();
  add("Café");
  const [item] = useListStore.getState().items;
  expect(item).toMatchObject({ label: "Café", checked: false });

  toggle(item.id);
  expect(useListStore.getState().items[0].checked).toBe(true);

  update(item.id, "Thé");
  expect(useListStore.getState().items[0].label).toBe("Thé");

  update(item.id, "");
  expect(useListStore.getState().items).toHaveLength(0);
});
