import type { CreateRecipe } from "@woj/contract";
import { constituents, recipes, recipesToTags, steps } from "@woj/db";
import { eq } from "drizzle-orm";
import type { Tx } from "../../lib/db";
import { ingredientOptions } from "../ingredient/ingredient.options";

const MAX_CALORIES_PER_100 = 900;
const MEASURED_UNITS = ["Kilogramme", "Litre"];

export interface CalorieConstituent {
  quantity: number;
  unit: { title: string };
  ingredient: {
    calories: number;
    defaultUnit: { title: string };
    conversions: { factor: number; unit: { title: string } }[];
  };
}

export function getConstituentCalories({
  quantity,
  unit,
  ingredient,
}: CalorieConstituent) {
  const natural = ingredient.defaultUnit.title;
  const factor =
    unit.title === natural
      ? 1
      : ingredient.conversions.find((c) => c.unit.title === unit.title)?.factor;
  if (factor == null) return 0;
  const amount = quantity * factor;
  if (!MEASURED_UNITS.includes(natural)) return ingredient.calories * amount;
  return Math.min(ingredient.calories, MAX_CALORIES_PER_100) * 10 * amount;
}

export function getRecipeCalories(constituents: CalorieConstituent[]) {
  return constituents.reduce((sum, c) => sum + getConstituentCalories(c), 0);
}

export async function recomputeRecipeCalories(tx: Tx, recipeId: number) {
  const recipe = await tx.query.recipes.findFirst({
    columns: { id: true },
    where: { id: recipeId },
    with: {
      constituents: {
        columns: { quantity: true },
        with: {
          unit: { columns: { title: true } },
          ingredient: ingredientOptions,
        },
      },
    },
  });
  if (recipe == null) return;
  await tx
    .update(recipes)
    .set({ calories: Math.round(getRecipeCalories(recipe.constituents)) })
    .where(eq(recipes.id, recipeId));
}

export async function replaceRecipeRelations(
  tx: Tx,
  recipeId: number,
  input: Partial<Pick<CreateRecipe, "constituents" | "steps" | "tagIds">>,
) {
  if (input.constituents) {
    await tx.delete(constituents).where(eq(constituents.recipeId, recipeId));
    if (input.constituents.length > 0) {
      await tx
        .insert(constituents)
        .values(input.constituents.map((c) => ({ ...c, recipeId })));
    }
    await recomputeRecipeCalories(tx, recipeId);
  }
  if (input.steps) {
    await tx.delete(steps).where(eq(steps.recipeId, recipeId));
    if (input.steps.length > 0) {
      await tx
        .insert(steps)
        .values(input.steps.map((s, order) => ({ ...s, order, recipeId })));
    }
  }
  if (input.tagIds) {
    await tx.delete(recipesToTags).where(eq(recipesToTags.recipeId, recipeId));
    if (input.tagIds.length > 0) {
      await tx
        .insert(recipesToTags)
        .values(input.tagIds.map((tagId) => ({ recipeId, tagId })));
    }
  }
}
