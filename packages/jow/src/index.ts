import type { z } from "zod";
import { IngredientSchema } from "./schemas/ingredient";
import { IngredientsSchema } from "./schemas/ingredients";
import { RecipeSchema } from "./schemas/recipe";
import { RecipesSchema } from "./schemas/recipes";

export * from "./schemas/abbreviation";
export * from "./schemas/ingredient";
export * from "./schemas/ingredients";
export * from "./schemas/recipe";
export * from "./schemas/recipes";
export * from "./schemas/unit";

export interface JowFetchInit extends RequestInit {
  json?: unknown;
}

export class JowClient {
  constructor(readonly baseUrl = "https://api.jow.fr/") {}

  async fetch(path: string, init: JowFetchInit = {}) {
    const url = new URL(path, this.baseUrl);
    init.keepalive ??= true;
    init.headers = new Headers(init.headers);
    init.headers.set("accept", "application/json");
    init.headers.set("accept-language", "fr");
    if (init.json) {
      init.body = JSON.stringify(init.json);
      init.headers.set("content-type", "application/json");
    }
    const response = await fetch(url, init);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    return response;
  }

  async fetchJson<T extends z.ZodType>(
    path: string,
    schema: T,
    init: JowFetchInit = {},
  ) {
    const response = await this.fetch(path, init);
    const raw = await response.json();
    return schema.parse(raw);
  }

  // API endpoints

  async fetchRecipe(recipeId: string) {
    return this.fetchJson(`public/recipe/${recipeId}`, RecipeSchema);
  }

  async fetchIngredients() {
    return this.fetchJson("public/ingredients", IngredientsSchema);
  }

  async fetchIngredient(ingredientId: string) {
    return this.fetchJson(
      `public/ingredient/${ingredientId}`,
      IngredientSchema,
    );
  }

  async fetchRecipesFromIngredient(ingredientId: string) {
    return this.fetchJson(
      `public/recipes/recipesFromIngredientsId`,
      RecipesSchema,
      { method: "POST", json: [ingredientId] },
    );
  }
}
