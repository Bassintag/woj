import type { Ingredient, Recipe, Unit } from "@woj/jow";

export async function batch<T, R>(
  rows: T[],
  insert: (rows: T[]) => PromiseLike<R>,
  size = 100,
) {
  const results: R[] = [];
  for (let i = 0; i < rows.length; i += size) {
    results.push(await insert(rows.slice(i, i + size)));
  }
  return results;
}

export function idByTitle(rows: { id: number; title: string }[]) {
  return new Map(rows.map((r) => [r.title, r.id]));
}

export function getCalories(ingredient: Ingredient) {
  const energy = ingredient.editorialData.nutritionalFacts.find(
    (n) => n.id === "ENERC",
  );
  return energy?.amount ?? 0;
}

export function getQuantity(constituent: Recipe["constituents"][number]) {
  return "quantityPerCover" in constituent
    ? constituent.quantityPerCover
    : constituent.ingredient.quantityPerCover;
}

const MAX_PLAUSIBLE_CALORIES = 2000;

export function getJowCalories(recipe: Recipe) {
  const calories = recipe.nutritionalFacts?.find(
    (n) => n.id === "ENERC",
  )?.amount;
  return calories != null && calories <= MAX_PLAUSIBLE_CALORIES
    ? calories
    : undefined;
}

const DIETS = [
  ["vegan", "Végan"],
  ["vegetarian", "Végétarien"],
  ["porkless", "Sans porc"],
] as const;

export function getTags(recipe: Recipe) {
  const ancestors = (recipe.familyAncestors ?? []).map((a) => a.name);
  const families = ancestors.length > 1 ? ancestors.slice(1) : ancestors;
  const diets = DIETS.filter(
    ([key]) => recipe.eatingHabitsCompatibility?.[key],
  ).map(([, title]) => title);
  return [...new Set([...families, ...diets])];
}

export function getUnit(
  constituent: Recipe["constituents"][number],
  ingredient: Ingredient,
) {
  return constituent.unit ?? ingredient.naturalUnit;
}

export function getConversions(ingredients: Ingredient[]) {
  return [
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
}

export function getUnits(
  ingredients: Ingredient[],
  conversions: ReturnType<typeof getConversions>,
  extra: Unit[] = [],
) {
  return [
    ...new Map(
      [
        ...ingredients.map((i) => i.naturalUnit),
        ...conversions.map((c) => c.unit),
        ...extra,
      ].map((u) => [u.name, u]),
    ).values(),
  ];
}
