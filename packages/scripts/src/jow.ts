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
import * as path from "node:path";
import { v4 } from "uuid";
import { ImagesClient } from "./utils/images";

const upsertImage = async (imageUrl: string, folder: string) => {
  const extension = path.extname(imageUrl);
  const imageStream = await jow.fetchImage(imageUrl);
  const objectPath = `${folder}/${v4()}${extension}`;
  await images.save(objectPath, imageStream);
  return objectPath;
};

const seasons: Record<string, string> = {
  spring: "Printemps",
  summer: "Été",
  automn: "Automne",
  winter: "Hiver",
};

const upsertRecipe = async (data: JowRecipe) => {
  const existing = await prisma.recipe.findFirst({
    where: { name: data.title },
  });
  if (existing) return existing;
  const recipeIngredients = [
    ...data.constituents,
    ...data.additionalConstituents,
  ];
  let jowIngredient: JowIngredient;
  let jowUnit: JowUnit;
  const imagePath = await upsertImage(data.imageUrl, "recipes");
  const tags = [
    ...data.seasons.map((s) => seasons[s]).filter((s) => s != null),
    data.familyAncestors[data.familyAncestors.length - 1].name,
  ];
  const recipe = await prisma.recipe.create({
    data: {
      name: data.title,
      preppingTime:
        data.preparationTime + data.preparationExtraTimePerCover * 4,
      cookingTime: data.cookingTime,
      imagePath,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
  });
  for (const item of recipeIngredients) {
    jowIngredient = item.ingredient;
    jowUnit = item.ingredient.naturalUnit;
    const unit = await upsertUnit(jowUnit);
    const ingredient = await upsertIngredient(jowIngredient, unit.id);
    await upsertRecipeIngredient(item, ingredient.id, recipe.id);
  }
  await Promise.all(
    data.directions.map((direction, i) => upsertStep(direction, recipe.id, i)),
  );
  return recipe;
};

const upsertIngredient = async (data: JowIngredient, unitId: number) => {
  return prisma.$transaction(async (em) => {
    const existing = await em.ingredient.findFirst({
      where: { name: data.name },
    });
    if (existing) return existing;
    const imagePath = await upsertImage(data.imageUrl, "ingredients");
    const energyFact = data.editorialData.nutritionalFacts.find(
      (nutritionalFact) => nutritionalFact.code === "ENERC",
    );
    return em.ingredient.create({
      data: {
        name: data.name,
        energy: energyFact ? energyFact.amount / energyFact.portion : undefined,
        imagePath,
        unitId,
      },
    });
  });
};

const upsertRecipeIngredient = async (
  data: JowConstituent,
  ingredientId: number,
  recipeId: number,
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
    data: { ingredientId, recipeId, quantity },
  });
};

const upsertUnit = async (data: JowUnit) => {
  return prisma.$transaction(async (em) => {
    const existing = await em.unit.findFirst({ where: { name: data.name } });
    if (existing) return existing;
    return em.unit.create({
      data: {
        name: data.name,
        symbols: {
          createMany: {
            data: data.abbreviations.map((abbreviation) => ({
              name: abbreviation.label ?? "",
              factor: abbreviation.divisor,
              digits: abbreviation.digits,
              max: abbreviation.maxAmount,
              min: abbreviation.minAmount,
            })),
          },
        },
      },
    });
  });
};

const upsertStep = async (
  data: JowDirection,
  recipeId: number,
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
const images = new ImagesClient(process.env.IMAGES_DIRECTORY as string);

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
