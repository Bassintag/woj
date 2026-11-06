import type { Ingredient, Recipe } from "@woj/jow";

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

export function getRecipeCalories(
  constituents: { ingredientId: number; quantity: number }[],
  caloriesById: Map<number | undefined, number | undefined>,
) {
  return constituents.reduce(
    (sum, c) => sum + (caloriesById.get(c.ingredientId) ?? 0) * c.quantity,
    0,
  );
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
) {
  return [
    ...new Map(
      [
        ...ingredients.map((i) => i.naturalUnit),
        ...conversions.map((c) => c.unit),
      ].map((u) => [u.name, u]),
    ).values(),
  ];
}
