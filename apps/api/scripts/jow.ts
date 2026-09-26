import * as tables from "@woj/db";
import * as j from "@woj/jow";
import { sql } from "drizzle-orm";
import { createDb } from "../src/lib/db";
import { createEnv } from "../src/lib/env";

const env = createEnv();

const jow = new j.JowClient();

const db = createDb(env);

// parse

type Unit = ReturnType<typeof parseUnit>;
type Ingredient = ReturnType<typeof parseIngredient>;

const unitMap = new Map<string, Unit>();
const ingredientMap = new Map<string, Ingredient>();

function parseUnit(unit: j.Unit) {
  const parsed = {
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

  unitMap.set(parsed.id, parsed);

  return parsed;
}

function parseIngredient(ingredient: j.Ingredient) {
  const parsed = {
    id: ingredient.id,
    title: ingredient.name,
    imageUrl: ingredient.imageUrl,
    calories: ingredient.editorialData.nutritionalFacts.find(
      (n) => n.id === "ENERC",
    )?.amount,
    defaultUnit: parseUnit(ingredient.naturalUnit),
    units: ingredient.displayableUnits.map((u) => parseUnit(u.unit)),
  };

  ingredientMap.set(parsed.id, parsed);

  return parsed;
}

// fetch

await Promise.all(
  (await jow.fetchIngredients()).map(async ({ id }) => {
    const ingredient = await jow.fetchIngredient(id);
    parseIngredient(ingredient);
  }),
);

console.log({
  units: unitMap.size,
  ingredients: ingredientMap.size,
});

// Symbols

const units = Array.from(unitMap.values());

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
      title: sql`excluded."title"`,
      digits: sql`excluded."digits"`,
      factor: sql`excluded."factor"`,
      min: sql`excluded."min"`,
      max: sql`excluded."max"`,
      unitId: sql`excluded."unit_id"`,
    },
    target: [tables.symbols.title, tables.symbols.unitId],
  });

// Ingredients

const ingredients = Array.from(ingredientMap.values());

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
      title: sql`excluded."title"`,
      calories: sql`excluded."calories"`,
      defaultUnitId: sql`excluded."default_unit_id"`,
    },
    target: [tables.ingredients.title],
  })
  .returning({ id: tables.ingredients.id });

const dbIngredientMap = new Map(dbUnits.map(({ id }, i) => [units[i]?.id, id]));
