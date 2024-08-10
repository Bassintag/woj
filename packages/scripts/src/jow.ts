import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { JowClient } from "./utils/jow";
import {
  JowConstituent,
  JowDirection,
  JowIngredient,
  JowRecipe,
  JowUnit,
} from "./domain/jow";
import { createMinioClient } from "./utils/minio";
import * as path from "node:path";
import { v4 } from "uuid";

const upsertImage = async (imageUrl: string, folder: string) => {
  const extension = path.extname(imageUrl);
  const imageStream = await jow.fetchImage(imageUrl);
  const objectPath = `${folder}/${v4()}${extension}`;
  await minio.putObject("woj", objectPath, imageStream);
  return objectPath;
};

const upsertRecipe = async (data: JowRecipe) => {
  const existing = await prisma.recipe.findFirst({
    where: { name: data.title },
  });
  if (existing) return existing;
  const recipeIngredients = data.constituents;
  let jowIngredient: JowIngredient;
  let jowUnit: JowUnit;
  const imagePath = await upsertImage(data.imageUrl, "recipes");
  const recipe = await prisma.recipe.create({
    data: {
      name: data.title,
      preppingTime: data.preparationTime,
      cookingTime: data.cookingTime,
      imagePath,
    },
  });
  for (const item of recipeIngredients) {
    jowIngredient = item.ingredient;
    jowUnit = item.unit;
    const [ingredient, unit] = await Promise.all([
      upsertIngredient(jowIngredient),
      upsertUnit(jowUnit),
    ]);
    await upsertRecipeIngredient(item, ingredient.id, recipe.id, unit.id);
  }
  await Promise.all(
    data.directions.map((direction, i) => upsertStep(direction, recipe.id, i)),
  );
  return recipe;
};

const upsertIngredient = async (data: JowIngredient) => {
  return prisma.$transaction(async (em) => {
    const existing = await em.ingredient.findFirst({
      where: { name: data.name },
    });
    if (existing) return existing;
    const imagePath = await upsertImage(data.imageUrl, "ingredients");
    return em.ingredient.create({
      data: {
        name: data.name,
        energy: data.editorialData?.nutritionalFacts.find(
          (nutritionalFact) => nutritionalFact.code === "ENERC",
        )?.amount,
        imagePath,
      },
    });
  });
};

const upsertRecipeIngredient = async (
  data: JowConstituent,
  ingredientId: string,
  recipeId: string,
  unitId: string,
) => {
  const constituentUnitId = data.unit._id;
  let quantity: number;
  if (data.unit.isNatural) {
    quantity = data.quantityPerCover;
  } else {
    const alternativeUnit = data.ingredient.alternativeUnits.find(
      (alternativeUnit) => alternativeUnit.unit._id === constituentUnitId,
    );
    if (alternativeUnit == null) {
      throw new Error("alternative unit not found");
    }
    quantity = data.quantityPerCover * alternativeUnit.quantity;
  }
  return prisma.recipeIngredient.create({
    data: {
      ingredientId,
      unitId,
      recipeId,
      quantity,
    },
  });
};

const upsertUnit = async (data: JowUnit) => {
  return prisma.$transaction(async (em) => {
    const existing = await em.unit.findFirst({ where: { name: data.name } });
    if (existing) return existing;
    const abbreviation = data.abbreviations.find(
      (abbreviation) => abbreviation.divisor === 1,
    );
    if (abbreviation == null) {
      throw new Error("abbreviation unit not found");
    }
    return em.unit.create({
      data: {
        name: data.name,
        symbol: abbreviation?.label ?? "",
      },
    });
  });
};

const upsertStep = async (
  data: JowDirection,
  recipeId: string,
  order: number,
) => {
  return prisma.step.create({
    data: { recipeId, description: data.label, order },
  });
};

config({
  path: [".env", "../../.env"],
});

const prisma = new PrismaClient();
const jow = new JowClient();
const minio = createMinioClient();

const main = async () => {
  const ingredients = await jow.fetchIngredients();
  for (const ingredient of ingredients) {
    const recipeLists = await jow.fetchRecipesFromIngredientId(ingredient._id);
    const recipes = recipeLists.flatMap((list) => list.recipes);
    for (const { _id, title } of recipes) {
      const existing = await prisma.recipe.findFirst({
        select: { id: true },
        where: { name: title },
      });
      if (existing) continue;
      const recipe = await jow.fetchRecipe(_id);
      await upsertRecipe(recipe);
    }
  }
};

void main();
