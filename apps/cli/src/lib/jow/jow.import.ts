import type { RouterContractClient } from "@orpc/contract";
import type { CreateUnit, contract } from "@woj/contract";
import * as j from "@woj/jow";
import pMap from "p-map";
import {
  getCalories,
  getConversions,
  getJowCalories,
  getQuantity,
  getTags,
  getUnit,
  idByTitle,
} from "./jow.transform";

const STATIC_URL = "https://static.jow.fr/";
const DISCOVER_CONCURRENCY = 64;
const IMPORT_CONCURRENCY = 32;

export interface ImportCount {
  created: number;
  existing: number;
}

export interface ImportResult {
  units: ImportCount;
  tags: ImportCount;
  ingredients: ImportCount;
  recipes: { created: number; updated: number };
  failures: string[];
}

interface Pending {
  title: string;
  create: () => Promise<number>;
}

function createRegistry(titles: Map<string, number>) {
  const ids = new Map<string, Promise<number>>();
  const count: ImportCount = { created: 0, existing: 0 };

  function resolve(key: string, prepare: () => Promise<Pending> | Pending) {
    let id = ids.get(key);
    if (id == null) {
      id = (async () => {
        const { title, create } = await prepare();
        const known = titles.get(title);
        if (known != null) {
          count.existing++;
          return known;
        }
        const created = await create();
        titles.set(title, created);
        count.created++;
        return created;
      })();
      ids.set(key, id);
    }
    return id;
  }

  return { resolve, count };
}

export async function importJow(
  client: RouterContractClient<typeof contract>,
): Promise<ImportResult> {
  const jow = new j.JowClient();
  const failures: string[] = [];

  const [existingUnits, existingTags, existingIngredients, existingRecipes] =
    await Promise.all([
      client.units.list(),
      client.tags.list(),
      client.ingredients.list(),
      client.recipes.list(),
    ]);

  const units = createRegistry(idByTitle(existingUnits));
  const tags = createRegistry(idByTitle(existingTags));
  const ingredients = createRegistry(idByTitle(existingIngredients));
  const recipeTitles = idByTitle(existingRecipes);
  const recipes = { created: 0, updated: 0 };

  async function uploadImage(
    kind: "ingredients" | "recipes",
    id: number,
    url: string | null | undefined,
  ) {
    if (!url) return;
    try {
      const res = await fetch(new URL(url, STATIC_URL));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const extension = blob.type.split("/")[1];
      const file = new File([blob], `${id}.${extension}`, { type: blob.type });
      await client.images.upload({ kind, id, file });
    } catch (error) {
      failures.push(`${kind}/${id} image: ${(error as Error).message}`);
    }
  }

  function unitId(unit: j.Unit) {
    return units.resolve(unit.name, () => ({
      title: unit.name,
      create: async () => {
        const symbols: CreateUnit["symbols"] = [
          ...new Map(
            unit.abbreviations
              .filter((a) => a.label.trim() !== "")
              .map((a) => [
                a.label,
                {
                  title: a.label,
                  digits: a.digits,
                  factor: 1 / a.divisor,
                  min: a.minAmount,
                  max: a.maxAmount,
                },
              ]),
          ).values(),
        ];
        return (await client.units.create({ title: unit.name, symbols })).id;
      },
    }));
  }

  function tagId(title: string) {
    return tags.resolve(title, () => ({
      title,
      create: async () => (await client.tags.create({ title })).id,
    }));
  }

  const fetched = new Map<string, Promise<j.Ingredient>>();

  function fetchIngredient(id: string) {
    let ingredient = fetched.get(id);
    if (ingredient == null) {
      ingredient = jow.fetchIngredient(id);
      fetched.set(id, ingredient);
    }
    return ingredient;
  }

  function ingredientId(id: string) {
    return ingredients.resolve(id, async () => {
      const ingredient = await fetchIngredient(id);
      return {
        title: ingredient.name,
        create: async () => {
          const created = await client.ingredients.create({
            title: ingredient.name,
            calories: Math.round(getCalories(ingredient)),
            defaultUnitId: await unitId(ingredient.naturalUnit),
            conversions: await Promise.all(
              getConversions([ingredient]).map(async (c) => ({
                unitId: await unitId(c.unit),
                factor: c.quantity,
              })),
            ),
          });
          await uploadImage("ingredients", created.id, ingredient.imageUrl);
          return created.id;
        },
      };
    });
  }

  async function importRecipe(id: string, existingId?: number) {
    const recipe = await jow.fetchRecipe(id);
    const constituents = await Promise.all(
      recipe.constituents.map(async (c) => {
        const ingredient = await fetchIngredient(c.ingredient.id);
        return {
          ingredientId: await ingredientId(c.ingredient.id),
          unitId: await unitId(getUnit(c, ingredient)),
          quantity: getQuantity(c),
        };
      }),
    );
    const data = {
      title: recipe.title,
      calories: getJowCalories(recipe),
      bakingTime: recipe.cookingTime,
      cookingTime: recipe.preparationTime,
      constituents,
      steps: recipe.directions.map((d) => ({ description: d.label })),
      tagIds: await Promise.all(getTags(recipe).map(tagId)),
    };
    if (existingId != null) {
      await client.recipes.update({ id: existingId, ...data });
      recipes.updated++;
      return;
    }
    const created = await client.recipes.create(data);
    await uploadImage("recipes", created.id, recipe.imageUrl);
    recipes.created++;
  }

  const stubs = new Map(
    (
      await pMap(
        await jow.fetchIngredients(),
        ({ id }) => jow.fetchRecipesFromIngredient(id),
        { concurrency: DISCOVER_CONCURRENCY },
      )
    )
      .flat()
      .flatMap((group) => group.recipes)
      .map((r) => [r.id, r]),
  );

  const byTitle = new Map(
    [...stubs.values()].map(({ id, title }) => [title, id]),
  );

  await pMap(
    byTitle,
    async ([title, id]) => {
      try {
        await importRecipe(id, recipeTitles.get(title));
      } catch (error) {
        failures.push(`recipe ${id}: ${(error as Error).message}`);
      }
    },
    { concurrency: IMPORT_CONCURRENCY },
  );

  return {
    units: units.count,
    tags: tags.count,
    ingredients: ingredients.count,
    recipes,
    failures,
  };
}
