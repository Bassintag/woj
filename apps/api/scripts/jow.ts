import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import * as tables from "@woj/db";
import * as j from "@woj/jow";
import { sql } from "drizzle-orm";
import pMap from "p-map";
import { createDb } from "../src/lib/db";
import { createEnv } from "../src/lib/env";

const env = createEnv();
const jow = new j.JowClient();
const db = createDb(env);

function map<T, R>(items: T[], fn: (item: T) => Promise<R>) {
  return pMap(items, fn, { concurrency: 64 });
}

async function batch<T, R>(rows: T[], insert: (rows: T[]) => PromiseLike<R>) {
  const results: R[] = [];
  for (let i = 0; i < rows.length; i += 100) {
    results.push(await insert(rows.slice(i, i + 100)));
  }
  return results;
}

function idByTitle(rows: { id: number; title: string }[]) {
  return new Map(rows.map((r) => [r.title, r.id]));
}

async function writeImage(
  kind: "ingredients" | "recipes",
  id: string,
  url: string | null | undefined,
) {
  if (!url) return null;
  const relativePath = `${kind}/${id}.webp`;
  const path = join(env.IMAGES_DIRECTORY, relativePath);
  if (!(await Bun.file(path).exists())) {
    const res = await fetch(new URL(url, "https://static.jow.fr/"));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(path), { recursive: true });
    await new Bun.Image(await res.arrayBuffer())
      .webp({ quality: 80 })
      .write(path);
  }
  return relativePath;
}

const ingredients = await map(await jow.fetchIngredients(), async ({ id }) => {
  const ingredient = await jow.fetchIngredient(id);
  const imagePath = await writeImage(
    "ingredients",
    ingredient.id,
    ingredient.imageUrl,
  );
  return { ...ingredient, imagePath };
});

const recipeIds = new Set(
  (await map(ingredients, (i) => jow.fetchRecipesFromIngredient(i.id)))
    .flat()
    .flatMap((group) => group.recipes.map((r) => r.id)),
);

const recipes = await map([...recipeIds], async (id) => {
  const recipe = await jow.fetchRecipe(id);
  const imagePath = await writeImage("recipes", recipe.id, recipe.imageUrl);
  return { ...recipe, imagePath };
});

const conversions = [
  ...new Map(
    ingredients
      .flatMap((ingredient) => {
        return ingredient.recipes
          .flatMap((r) => r.constituents)
          .filter((c) => c.ingredient.id === ingredient.id)
          .flatMap((c) => c.ingredient.alternativeUnits ?? [])
          .filter((a) => a.id != null)
          .map((a) => ({ ingredient, ...a }));
      })
      .map((c) => [`${c.ingredient.id}:${c.unit.name}`, c]),
  ).values(),
];

const units = [
  ...new Map(
    [
      ...ingredients.map((i) => i.naturalUnit),
      ...conversions.map((c) => c.unit),
    ].map((u) => [u.name, u]),
  ).values(),
];

const unitIds = idByTitle(
  (
    await batch(
      units.map((u) => ({ title: u.name })),
      (rows) => {
        return db
          .insert(tables.units)
          .values(rows)
          .onConflictDoUpdate({
            target: [tables.units.title],
            set: { title: sql`excluded."title"` },
          })
          .returning({ id: tables.units.id, title: tables.units.title });
      },
    )
  ).flat(),
);

await batch(
  units.flatMap((u) => {
    return u.abbreviations.map((a) => {
      return {
        title: a.label,
        digits: a.digits,
        factor: 1 / a.divisor,
        min: a.minAmount,
        max: a.maxAmount,
        unitId: unitIds.get(u.name) as number,
      };
    });
  }),
  (rows) => {
    return db
      .insert(tables.symbols)
      .values(rows)
      .onConflictDoUpdate({
        target: [tables.symbols.title, tables.symbols.unitId],
        set: {
          digits: sql`excluded."digits"`,
          factor: sql`excluded."factor"`,
          min: sql`excluded."min"`,
          max: sql`excluded."max"`,
        },
      });
  },
);

const calories = new Map(
  ingredients.map((i) => {
    const energy = i.editorialData.nutritionalFacts.find(
      (n) => n.id === "ENERC",
    );
    return [i.id, energy?.amount ?? 0];
  }),
);

const ingredientTitleIds = idByTitle(
  (
    await batch(
      ingredients.map((i) => {
        return {
          title: i.name,
          imageUrl: i.imagePath,
          calories: calories.get(i.id) as number,
          defaultUnitId: unitIds.get(i.naturalUnit.name) as number,
        };
      }),
      (rows) => {
        return db
          .insert(tables.ingredients)
          .values(rows)
          .onConflictDoUpdate({
            target: [tables.ingredients.title],
            set: {
              imageUrl: sql`excluded."image_url"`,
              calories: sql`excluded."calories"`,
              defaultUnitId: sql`excluded."default_unit_id"`,
            },
          })
          .returning({
            id: tables.ingredients.id,
            title: tables.ingredients.title,
          });
      },
    )
  ).flat(),
);

const ingredientIds = new Map(
  ingredients.map((i) => [i.id, ingredientTitleIds.get(i.name) as number]),
);

await batch(
  conversions.map((c) => {
    return {
      factor: c.quantity,
      ingredientId: ingredientIds.get(c.ingredient.id) as number,
      unitId: unitIds.get(c.unit.name) as number,
    };
  }),
  (rows) => {
    return db
      .insert(tables.conversions)
      .values(rows)
      .onConflictDoUpdate({
        target: [tables.conversions.ingredientId, tables.conversions.unitId],
        set: { factor: sql`excluded."factor"` },
      });
  },
);

const caloriesById = new Map(
  ingredients.map((i) => [ingredientIds.get(i.id), calories.get(i.id)]),
);

const recipeRows = recipes.map((recipe) => {
  const constituents = recipe.constituents.flatMap((c) => {
    const ingredientId = ingredientIds.get(c.ingredient.id);
    if (ingredientId == null) return [];
    const quantity =
      "quantityPerCover" in c
        ? c.quantityPerCover
        : c.ingredient.quantityPerCover;
    return [{ ingredientId, quantity }];
  });

  return {
    title: recipe.title,
    imageUrl: recipe.imagePath,
    bakingTime: recipe.cookingTime,
    cookingTime: recipe.preparationTime,
    calories: constituents.reduce(
      (sum, c) => sum + (caloriesById.get(c.ingredientId) ?? 0) * c.quantity,
      0,
    ),
    constituents,
    steps: recipe.directions.map((d, order) => {
      return { order, description: d.label };
    }),
  };
});

const recipeIdByTitle = idByTitle(
  (
    await batch(recipeRows, (rows) => {
      return db
        .insert(tables.recipes)
        .values(rows)
        .onConflictDoUpdate({
          target: [tables.recipes.title],
          set: {
            imageUrl: sql`excluded."image_url"`,
            bakingTime: sql`excluded."baking_time"`,
            cookingTime: sql`excluded."cooking_time"`,
            calories: sql`excluded."calories"`,
          },
        })
        .returning({ id: tables.recipes.id, title: tables.recipes.title });
    })
  ).flat(),
);

await batch(
  recipeRows.flatMap((r) => {
    return r.constituents.map((c) => {
      return { ...c, recipeId: recipeIdByTitle.get(r.title) as number };
    });
  }),
  (rows) => {
    return db
      .insert(tables.constituents)
      .values(rows)
      .onConflictDoUpdate({
        target: [
          tables.constituents.recipeId,
          tables.constituents.ingredientId,
        ],
        set: { quantity: sql`excluded."quantity"` },
      });
  },
);

await batch(
  recipeRows.flatMap((r) => {
    return r.steps.map((s) => {
      return { ...s, recipeId: recipeIdByTitle.get(r.title) as number };
    });
  }),
  (rows) => db.insert(tables.steps).values(rows).onConflictDoNothing(),
);
