import { ingredients, units } from "@woj/db";
import pino from "pino";
import { createApp } from "../src/app";
import type { Context } from "../src/context";
import { createTestDb } from "../src/lib/testing";

export const API_KEY = "test-key";

export async function createTestApp() {
  const db = await createTestDb();
  await db.insert(units).values([
    { id: 1, title: "Pièce" },
    { id: 2, title: "Gramme" },
  ]);
  await db
    .insert(ingredients)
    .values({ id: 1, title: "Oeuf", calories: 100, defaultUnitId: 1 });
  const context = {
    db,
    log: pino({ level: "silent" }),
    env: { API_KEY: API_KEY, ADMIN_USERNAME: "admin", ADMIN_PASSWORD: "pw" },
  } as unknown as Context;
  const app = createApp(context);

  async function request(
    method: string,
    path: string,
    options: { body?: unknown; headers?: Record<string, string> } = {},
  ) {
    const { body, headers = { "x-api-key": API_KEY } } = options;
    const response = await app(
      new Request(`http://localhost${path}`, {
        method,
        headers: {
          ...headers,
          ...(body === undefined ? {} : { "content-type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    );
    const text = await response.text();
    return {
      status: response.status,
      json: text ? JSON.parse(text) : undefined,
    };
  }

  return { db, request };
}
