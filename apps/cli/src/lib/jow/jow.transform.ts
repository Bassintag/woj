import type { Ingredient, Recipe } from "@woj/jow";

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

const EXCLUDED_FAMILIES = new Set(["Protéines Animales", "Fait maison"]);

const SEASONS = [
  ["spring", "Printemps"],
  ["summer", "Été"],
  ["automn", "Automne"],
  ["winter", "Hiver"],
] as const;

export function getTags(recipe: Recipe) {
  const ancestors = (recipe.familyAncestors ?? []).map((a) => a.name);
  const families = (
    ancestors.length > 1 ? ancestors.slice(1) : ancestors
  ).filter((name) => !EXCLUDED_FAMILIES.has(name));
  const diets = DIETS.filter(
    ([key]) => recipe.eatingHabitsCompatibility?.[key],
  ).map(([, title]) => title);
  const seasons = SEASONS.filter(([key]) => recipe.seasons?.includes(key));
  return [
    ...new Set([
      ...families,
      ...diets,
      ...(seasons.length < SEASONS.length
        ? seasons.map(([, title]) => title)
        : []),
    ]),
  ];
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
