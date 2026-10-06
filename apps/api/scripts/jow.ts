import * as tables from "@woj/db";
import * as j from "@woj/jow";
import { sql } from "drizzle-orm";
import { createDb } from "../src/lib/db";
import { createEnv } from "../src/lib/env";

const env = createEnv();

const jow = new j.JowClient();

const db = createDb(env);

function withMap<ArgsT extends unknown[], ResultT extends { id?: string }>(
  callback: (...args: ArgsT) => ResultT,
) {
  const map = new Map<string, ResultT>();

  function all() {
    return Array.from(map.values());
  }

  return Object.assign(
    (...args: ArgsT) => {
      const result = callback(...args);
      if (result.id) {
        map.set(result.id, result);
      }
      return result;
    },
    { map, all },
  );
}

// parse

const parseUnit = withMap((unit: j.Unit) => {
  return {
    id: unit.id,
    title: unit.name,
    abbreviations: unit.abbreviations.map((abbreviation) => ({
      id: abbreviation.id,
      title: abbreviation.label,
      digits: abbreviation.digits,
      factor: 1 / abbreviation.divisor,
      min: abbreviation.minAmount,
      max: abbreviation.maxAmount,
    })),
  };
});

const parseAlternativeUnit = withMap(
  (ingredient: j.Ingredient, alternativeUnit: j.AlternativeUnit) => {
    return {
      id: alternativeUnit.id,
      factor: alternativeUnit.quantity,
      ingredient,
      unit: parseUnit(alternativeUnit.unit),
    };
  },
);

const parseIngredient = withMap((ingredient: j.Ingredient) => {
  return {
    id: ingredient.id,
    title: ingredient.name,
    imageUrl: ingredient.imageUrl,
    calories: ingredient.editorialData.nutritionalFacts.find(
      (n) => n.id === "ENERC",
    )?.amount,
    defaultUnit: parseUnit(ingredient.naturalUnit),
    conversions: ingredient.recipes
      .flatMap((r) =>
        r.constituents.filter((c) => c.ingredient.id === ingredient.id),
      )
      .flatMap((c) =>
        c.ingredient.alternativeUnits
          ?.map((a) => {
            return parseAlternativeUnit(ingredient, a);
          })
          .filter((a) => a.id != null),
      ),
  };
});

// fetch

const jowIngredients = await jow.fetchIngredients();

await Promise.all(
  jowIngredients.map(async ({ id }) => {
    const joIingredient = await jow.fetchIngredient(id);
    parseIngredient(joIingredient);
  }),
);

// Symbols

const units = parseUnit.all();

const dbUnits = await db
  .insert(tables.units)
  .values(units.map((u) => ({ title: u.title })))
  .onConflictDoUpdate({
    set: { title: sql`excluded."title"` },
    target: [tables.units.title],
  })
  .returning({ id: tables.units.id });

const dbUnitMap = new Map(dbUnits.map(({ id }, i) => [units[i]?.id, id]));

await db
  .insert(tables.symbols)
  .values(
    units.flatMap((u) =>
      u.abbreviations.map((a) => ({
        title: a.title,
        digits: a.digits,
        factor: a.factor,
        min: a.min,
        max: a.max,
        unitId: dbUnitMap.get(u.id) as number,
      })),
    ),
  )
  .onConflictDoUpdate({
    set: {
      digits: sql`excluded."digits"`,
      factor: sql`excluded."factor"`,
      min: sql`excluded."min"`,
      max: sql`excluded."max"`,
    },
    target: [tables.symbols.title, tables.symbols.unitId],
  });

// Ingredients

const ingredients = parseIngredient.all();

const dbIngredients = await db
  .insert(tables.ingredients)
  .values(
    ingredients.map((i) => ({
      title: i.title,
      calories: i.calories ?? 0,
      defaultUnitId: dbUnitMap.get(i.defaultUnit.id) as number,
    })),
  )
  .onConflictDoUpdate({
    set: {
      calories: sql`excluded."calories"`,
      defaultUnitId: sql`excluded."default_unit_id"`,
    },
    target: [tables.ingredients.title],
  })
  .returning({ id: tables.ingredients.id });

const dbIngredientMap = new Map(
  dbIngredients.map(({ id }, i) => [ingredients[i]?.id, id]),
);

// Conversions

const alternativeUnits = parseAlternativeUnit.all();

await db
  .insert(tables.conversions)
  .values(
    alternativeUnits.map((a) => ({
      factor: a.factor,
      ingredientId: dbIngredientMap.get(a.ingredient.id) as number,
      unitId: dbUnitMap.get(a.unit.id) as number,
    })),
  )
  .onConflictDoUpdate({
    set: {
      factor: sql`excluded.factor`,
    },
    target: [tables.conversions.ingredientId, tables.conversions.unitId],
  });

for (const jowIngredient of jowIngredients) {
  const parseRecipe = withMap((recipe: j.Recipe) => {
    const constituents = recipe.constituents.map((c) => ({
      quantity:
        "quantityPerCover" in c
          ? c.quantityPerCover
          : c.ingredient.quantityPerCover,
      ingredientId: c.ingredient.id,
    }));

    const calories = constituents.reduce((v, c) => {
      const ingredient = parseIngredient.map.get(c.ingredientId);
      if (ingredient?.calories == null) return v;
      return v + ingredient.calories * c.quantity;
    }, 0);

    return {
      id: recipe.id,
      title: recipe.title,
      imageUri: recipe.imageUrl,
      bakingTime: recipe.cookingTime,
      cookingTime: recipe.preparationTime,
      calories,
      constituents,
      steps: recipe.directions.map((d, i) => ({
        description: d.label,
        order: i,
      })),
    };
  });

  const jowRecipeGroups = await jow.fetchRecipesFromIngredient(
    jowIngredient.id,
  );

  const jowRecipes = await Promise.all(
    jowRecipeGroups.flatMap((g) => g.recipes.map((r) => jow.fetchRecipe(r.id))),
  );

  for (const jowRecipe of jowRecipes) {
    parseRecipe(jowRecipe);
  }

  const recipes = parseRecipe.all();

  if (recipes.length === 0) continue;

  const dbRecipes = await db
    .insert(tables.recipes)
    .values(
      recipes.map((r) => ({
        title: r.title,
        imageUrl: r.imageUri,
        bakingTime: r.bakingTime,
        cookingTime: r.cookingTime,
        calories: r.calories,
      })),
    )
    .onConflictDoUpdate({
      target: [tables.recipes.title],
      set: {
        imageUrl: sql`excluded."image_url"`,
        bakingTime: sql`excluded."baking_time"`,
        cookingTime: sql`excluded."cooking_time"`,
        calories: sql`excluded."calories"`,
      },
    })
    .returning({ id: tables.recipes.id });

  const dbRecipeMap = new Map(
    dbRecipes.map(({ id }, i) => [recipes[i]?.id, id]),
  );

  await db
    .insert(tables.constituents)
    .values(
      recipes.flatMap((r) =>
        r.constituents.map((c) => {
          const ingredient = dbIngredientMap.get(c.ingredientId);
          if (ingredient == null) {
            console.log(`MISSING INGREDIENT:${c.ingredientId}`);
          }
          return {
            quantity: c.quantity,
            recipeId: dbRecipeMap.get(r.id) as number,
            ingredientId: dbIngredientMap.get(c.ingredientId) as number,
          };
        }),
      ),
    )
    .onConflictDoUpdate({
      target: [tables.constituents.recipeId, tables.constituents.ingredientId],
      set: {
        quantity: sql`excluded."quantity"`,
      },
    });

  await db
    .insert(tables.steps)
    .values(
      recipes.flatMap((r) =>
        r.steps.map((c) => {
          return {
            recipeId: dbRecipeMap.get(r.id) as number,
            description: c.description,
            order: c.order,
          };
        }),
      ),
    )
    .onConflictDoNothing();
}
