import { beforeAll, expect, test } from "bun:test";
import { join } from "node:path";
import { createTestApp } from "./helpers";

let app: Awaited<ReturnType<typeof createTestApp>>;

beforeAll(async () => {
  app = await createTestApp();
});

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
  "base64",
);

function pngForm() {
  const form = new FormData();
  form.set("file", new File([PNG], "a.png", { type: "image/png" }));
  return form;
}

test("upload writes a webp and sets the ingredient image url", async () => {
  const res = await app.request("PUT", "/images/ingredients/1", {
    body: pngForm(),
  });
  expect(res.status).toBe(200);
  expect(res.json).toEqual({ imageUrl: "ingredients/1.webp" });
  const file = Bun.file(join(app.imagesDirectory, "ingredients/1.webp"));
  expect((await new Bun.Image(file).metadata()).format).toBe("webp");
  const ingredient = await app.request("GET", "/ingredients/1");
  expect(ingredient.json.imageUrl).toBe("ingredients/1.webp");
});

test("upload to an unknown entity is not found", async () => {
  const res = await app.request("PUT", "/images/recipes/999", {
    body: pngForm(),
  });
  expect(res.status).toBe(404);
});

test("upload requires authentication", async () => {
  const res = await app.request("PUT", "/images/ingredients/1", {
    body: pngForm(),
    headers: {},
  });
  expect(res.status).toBe(401);
});
