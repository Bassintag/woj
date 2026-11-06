import { expect, test } from "bun:test";
import { ORPCError } from "@orpc/server";
import { orThrow } from "./db";

test("orThrow returns the resolved value", async () => {
  expect(await orThrow(Promise.resolve({ id: 1 }))).toEqual({ id: 1 });
  expect(await orThrow(Promise.resolve(0))).toBe(0);
});

test("orThrow throws NOT_FOUND on null and undefined", async () => {
  for (const value of [null, undefined]) {
    const error = await orThrow(Promise.resolve(value)).catch((e) => e);
    expect(error).toBeInstanceOf(ORPCError);
    expect(error.code).toBe("NOT_FOUND");
  }
});
