import { expect, test } from "bun:test";
import type { Unit } from "@woj/contract";
import { formatQuantity } from "./quantity";

function symbol(
  title: string,
  factor: number,
  min: number | null,
  max: number | null,
  digits = 0,
) {
  return { id: 1, title, digits, factor, min, max };
}

const kilogram: Unit = {
  id: 1,
  title: "Kilogramme",
  symbols: [
    symbol("mg", 1e-6, 0, 0.001),
    symbol("g", 0.001, 0.001, 1),
    symbol("kg", 1, 1, null, 1),
  ],
};

const piece: Unit = {
  id: 2,
  title: "Pièce",
  symbols: [symbol("", 1, 1, null, 1)],
};

test("formatQuantity picks the symbol matching the quantity", () => {
  expect(formatQuantity(0.15, kilogram)).toBe("150 g");
  expect(formatQuantity(1.5, kilogram)).toBe("1,5 kg");
  expect(formatQuantity(0.0005, kilogram)).toBe("500 mg");
});

test("formatQuantity falls back to the first symbol when none matches", () => {
  expect(formatQuantity(0.25, piece)).toBe("0,3");
});

test("formatQuantity omits the empty symbol title", () => {
  expect(formatQuantity(3, piece)).toBe("3");
});

test("formatQuantity returns the raw quantity without symbols", () => {
  expect(formatQuantity(2, { id: 3, title: "x", symbols: [] })).toBe("2");
});
