import {
  JowIngredient,
  JowRecipe,
  JowRecipesWithAdditionalIngredients,
} from "../domain/jow";
import { Readable } from "node:stream";

interface JowFetchInit {
  method?: string;
  json?: unknown;
}

export class JowClient {
  async fetch<T>(
    path: string,
    { method, json }: JowFetchInit = {},
  ): Promise<T> {
    const url = new URL(path, "https://api.jow.fr/");
    const init: RequestInit = { method, keepalive: true };
    if (json) {
      init.body = JSON.stringify(json);
      init.headers = { "Content-Type": "application/json" };
    }
    console.log(`[JOW API] ${method ?? "GET"} ${url.href}`);
    const response = await fetch(url, init);
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text);
    }
    if (text.length > 0) {
      return JSON.parse(text) as T;
    }
    return undefined as T;
  }

  async fetchRecipe(recipeId: string) {
    return this.fetch<JowRecipe>(`public/recipe/${recipeId}`);
  }

  async fetchRecipesFromIngredientId(ingredientId: string) {
    return this.fetch<JowRecipesWithAdditionalIngredients[]>(
      "public/recipes/recipesFromIngredientsId",
      {
        method: "POST",
        json: [ingredientId],
      },
    );
  }

  async fetchIngredients() {
    return this.fetch<JowIngredient[]>("public/ingredients");
  }

  async fetchImage(path: string) {
    const url = new URL(path, `https://static.jow.fr/`);
    console.log(`[JOW STATIC] ${url.href}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch static asset: ${response.status}`);
    }
    return Readable.fromWeb(response.body as any);
  }
}
