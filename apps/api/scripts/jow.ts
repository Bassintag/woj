import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import * as tables from "@woj/db";
import * as j from "@woj/jow";
import { sql } from "drizzle-orm";
import pMap from "p-map";
import { getRecipeCalories } from "../src/features/recipe/recipe.lib";
import { createDb } from "../src/lib/db";
import { createEnv } from "../src/lib/env";
import {
  batch,
  getCalories,
  getConversions,
  getJowCalories,
  getQuantity,
  getUnit,
  getUnits,
  idByTitle,
} from "./lib/transform";

const env = createEnv();
const jow = new j.JowClient();
const db = createDb(env);

function map<T, R>(items: T[], fn: (item: T) => Promise<R>) {
  return pMap(items, fn, { concurrency: 64 });
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

const conversions = getConversions(ingredients);

const ingredientsByJowId = new Map(ingredients.map((i) => [i.id, i]));

const constituentUnits = recipes.flatMap((recipe) => {
  return recipe.constituents.flatMap((c) => {
    const ingredient = ingredientsByJowId.get(c.ingredient.id);
    return ingredient ? [getUnit(c, ingredient)] : [];
  });
});

const units = getUnits(ingredients, conversions, constituentUnits);

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

const calories = new Map(ingredients.map((i) => [i.id, getCalories(i)]));

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

const calorieIngredients = new Map(
  ingredients.map((i) => [
    i.id,
    {
      calories: calories.get(i.id) as number,
      defaultUnit: { title: i.naturalUnit.name },
      conversions: conversions
        .filter((c) => c.ingredient.id === i.id)
        .map((c) => ({ factor: c.quantity, unit: { title: c.unit.name } })),
    },
  ]),
);

const recipeRows = recipes.map((recipe) => {
  const constituents = recipe.constituents.flatMap((c) => {
    const ingredient = ingredientsByJowId.get(c.ingredient.id);
    const ingredientId = ingredientIds.get(c.ingredient.id);
    if (ingredient == null || ingredientId == null) return [];
    const unit = getUnit(c, ingredient).name;
    return [
      {
        ingredientId,
        quantity: getQuantity(c),
        unitId: unitIds.get(unit) as number,
        calorie: {
          quantity: getQuantity(c),
          unit: { title: unit },
          ingredient: calorieIngredients.get(ingredient.id) as never,
        },
      },
    ];
  });

  return {
    title: recipe.title,
    imageUrl: recipe.imagePath,
    bakingTime: recipe.cookingTime,
    cookingTime: recipe.preparationTime,
    calories:
      getJowCalories(recipe) ??
      getRecipeCalories(constituents.map((c) => c.calorie)),
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
      const { calorie: _, ...row } = c;
      return { ...row, recipeId: recipeIdByTitle.get(r.title) as number };
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
        set: {
          quantity: sql`excluded."quantity"`,
          unitId: sql`excluded."unit_id"`,
        },
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
