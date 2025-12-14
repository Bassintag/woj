import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import {
  IngredientData,
  RecipeData,
  SourceAdapter,
  ToolData,
  UnitData,
} from './action.interface';
import sharp from 'sharp';
import { v3 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/interfaces/app-config.interface';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { SOURCE_ADAPTERS } from './action.const';

@Injectable()
export class ActionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SOURCE_ADAPTERS)
    private readonly adapters: SourceAdapter[],
    private readonly config: ConfigService<AppConfig>,
  ) {}

  private slug(value: string) {
    return slugify(value, { lower: true, locale: 'fr', remove: /[()]/g });
  }

  private async downloadImage(
    url: string | undefined,
    prefix: string,
    size: number,
  ) {
    if (url == null) return undefined;
    // Random namespace uuid
    const id = v3(url, 'adc337bc-ae0d-4d29-8577-219402ed8292');
    const relativePath = path.join(prefix, `${id}.webp`);
    const dir = this.config.getOrThrow('IMAGES_DIRECTORY');
    const outputPath = path.join(dir, relativePath);
    if (fs.existsSync(outputPath)) {
      return relativePath;
    }
    console.log('Downloading image at:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to retrieve image at url: ' + url);
    }
    await fs.promises.mkdir(path.join(dir, prefix), { recursive: true });
    await sharp(await response.arrayBuffer())
      .resize(size, size, { fit: 'cover' })
      .webp()
      .toFile(outputPath);
    return relativePath;
  }

  private async upsertUnit(unit: UnitData) {
    const slug = this.slug(unit.name);
    const data = {
      name: unit.name,
      slug,
      symbols: {
        connectOrCreate: unit.symbols.map((symbol) => {
          const slug = this.slug(symbol.name);
          return {
            where: { slug },
            create: {
              name: symbol.name,
              slug,
              factor: symbol.factor,
              digits: symbol.digits,
              min: symbol.min,
              max: symbol.max,
            },
          };
        }),
      },
    } satisfies Prisma.UnitCreateInput;
    return this.prisma.unit.upsert({
      select: { id: true },
      where: { slug },
      create: data,
      update: data,
    });
  }

  private async upsertIngredient(ingredient: IngredientData) {
    const slug = this.slug(ingredient.name);
    const defaultUnit = await this.upsertUnit(ingredient.defaultUnit);
    const conversionsData = await Promise.all(
      ingredient.conversions.map(async (conversion) => ({
        factor: conversion.factor,
        unitId: (await this.upsertUnit(conversion.unit)).id,
      })),
    );
    const data = {
      name: ingredient.name,
      slug,
      defaultUnit: { connect: defaultUnit },
      imagePath: await this.downloadImage(
        ingredient.imageUrl,
        'ingredients',
        256,
      ),
    } satisfies Prisma.IngredientCreateInput;
    const { id } = await this.prisma.ingredient.upsert({
      select: { id: true },
      where: { slug },
      create: {
        ...data,
        conversions: { createMany: { data: conversionsData } },
      },
      update: {
        ...data,
        conversions: {
          deleteMany: {},
          createMany: { data: conversionsData },
        },
      },
    });
    return {
      id,
      units: conversionsData.map((conversion) => ({ id: conversion.unitId })),
    };
  }

  private async upsertTool(tool: ToolData) {
    const slug = this.slug(tool.name);
    const data: Prisma.ToolCreateInput = {
      name: tool.name,
      slug,
      imagePath: await this.downloadImage(tool.imageUrl, 'tools', 128),
      trivial: tool.trivial,
    };
    return this.prisma.tool.upsert({
      select: { id: true },
      where: { slug },
      create: data,
      update: data,
    });
  }

  private async upsertRecipe(recipe: RecipeData) {
    const slug = this.slug(recipe.name);
    const stepsData = recipe.steps.map((step, i) => ({
      description: step.description,
      order: i,
    }));
    const data = {
      name: recipe.name,
      slug,
      cookingTime: recipe.cookingTime,
      preppingTime: recipe.preppingTime,
      energy: recipe.energy,
      imagePath: await this.downloadImage(recipe.imageUrl, 'recipes', 512),
      tags: {
        connectOrCreate: recipe.tags.map((tag) => {
          const slug = this.slug(tag.name);
          return {
            where: { slug },
            create: { name: tag.name, slug },
          };
        }),
      },
      tools: {
        connect: await Promise.all(
          recipe.tools.map((tool) => this.upsertTool(tool)),
        ),
      },
    } satisfies Prisma.RecipeCreateInput;
    const constituentsData = (await Promise.all(
      recipe.constituents.map(async (constituent) => {
        const ingredient = await this.upsertIngredient(constituent.ingredient);
        return {
          quantity: constituent.quantity,
          ingredientId: ingredient.id,
          unitId: (await this.upsertUnit(constituent.unit)).id,
        };
      }),
    )) satisfies Prisma.ConstituentCreateManyRecipeInput[];
    return this.prisma.recipe.upsert({
      select: { id: true },
      where: { slug },
      create: {
        ...data,
        constituents: { createMany: { data: constituentsData } },
        steps: { createMany: { data: stepsData } },
      },
      update: {
        ...data,
        constituents: {
          deleteMany: {},
          createMany: { data: constituentsData },
        },
        steps: { deleteMany: {}, createMany: { data: stepsData } },
      },
    });
  }

  async scrape(adapter: SourceAdapter) {
    for await (const recipe of adapter.listRecipes()) {
      await this.upsertRecipe(recipe);
    }
  }

  async scrapeAll() {
    for (const adapter of this.adapters) {
      await this.scrape(adapter);
    }
  }
}
