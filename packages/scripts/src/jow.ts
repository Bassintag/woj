import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

interface JowEntity {
  _id: string;
}

interface JowRecipe extends JowEntity {
  title: string;
  constituents: JowConstituent[];
  cookingTime: number;
  preparationTime: number;
}

interface JowConstituent extends JowEntity {
  ingredient: JowIngredient;
  //quantité en unit du constituant pour une personne
  quantityPerCover: number;
  unit: JowUnit;
}

interface JowIngredient extends JowEntity {
  name: string;
  naturalUnit: JowUnit;
  editorialData: JowEditorialData;
  alternativeUnits: JowAlternativeUnit[];
}

interface JowUnit extends JowEntity {
  name: string;
  isNatural?: true;
  abbreviations: JowAbbrveviation[];
}

interface JowAlternativeUnit extends JowEntity {
  unit: JowUnit;
  quantity: number;
}

interface JowEditorialData {
  nutritionalFacts: JowNutritionalFact[];
}

interface JowNutritionalFact extends JowEntity {
  amount: number;
  code: string;
}

interface JowAbbrveviation extends JowEntity {
  label: string;
  divisor: number;
}

config({
  path: [".env", "../../.env"],
});

const prisma = new PrismaClient();

const fetchJowRecipe = async (recipeId: string) => {
  const result = await fetch(`https://api.jow.fr/public/recipe/${recipeId}`);
  const recipe = await result.json();
  return recipe as JowRecipe;
};

const upsertRecipe = async (data: JowRecipe) => {
  const existing = await prisma.recipe.findFirst({
    where: { name: data.title },
  });
  if (existing) {
    return existing;
  }
  const recipeIngredients = data.constituents;
  let jowIngredient: JowIngredient;
  let jowUnit: JowUnit;
  const recipe = await prisma.recipe.create({
    data: {
      name: data.title,
      prepingTime: data.preparationTime,
      cookingTime: data.cookingTime,
    },
  });
  await Promise.all(
    recipeIngredients.map(async (item) => {
      jowIngredient = item.ingredient;
      jowUnit = item.unit;
      const ingredient = await upsertIngredient(jowIngredient);
      const unit = await upsertUnit(jowUnit);
      const recipeIngredient = await upsertRecipeIngredient(
        item,
        ingredient.id,
        recipe.id,
        unit.id,
      );
    }),
  );
  return recipe;
};

const upsertIngredient = async (data: JowIngredient) => {
  const existing = await prisma.ingredient.findFirst({
    where: { name: data.name },
  });
  if (existing) {
    return existing;
  }
  const ingredient = await prisma.ingredient.create({
    data: {
      name: data.name,
      energy: data.editorialData.nutritionalFacts.find(
        (nutritionalFact) => nutritionalFact.code === "ENERC",
      )?.amount,
    },
  });
  return ingredient;
};

const upsertRecipeIngredient = async (
  data: JowConstituent,
  ingredientId: string,
  recipeId: string,
  unitId: string,
) => {
  const consituentUnitId = data.unit._id;
  let quantity: number;
  if (data.unit.isNatural) {
    quantity = data.quantityPerCover;
  } else {
    const alternativeUnit = data.ingredient.alternativeUnits.find(
      (alternativeUnit) => alternativeUnit.unit._id === consituentUnitId,
    );
    if (alternativeUnit == null) {
      throw new Error("alternative unit not found");
    }
    quantity = data.quantityPerCover * alternativeUnit.quantity;
  }
  const recipeIngredient = await prisma.recipeIngredient.create({
    data: {
      ingredientId,
      unitId,
      recipeId,
      quantity,
    },
  });
  return recipeIngredient;
};

const upsertUnit = async (data: JowUnit) => {
  const existing = await prisma.unit.findFirst({ where: { name: data.name } });
  if (existing) {
    return existing;
  }
  const abbreviation = data.abbreviations.find(
    (abbreviation) => abbreviation.divisor === 1,
  );
  if (abbreviation == null) {
    throw new Error("abbreviation unit not found");
  }
  const unit = await prisma.unit.create({
    data: {
      name: data.name,
      symbol: abbreviation?.label,
    },
  });
  return unit;
};

const main = async () => {
  const recipe = await fetchJowRecipe("5eecba5dc438c10339f3acab");
  await upsertRecipe(recipe);
};

main();
