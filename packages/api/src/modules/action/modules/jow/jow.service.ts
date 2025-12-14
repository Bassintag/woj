import { Injectable } from '@nestjs/common';
import {
  ConversionData,
  RecipeData,
  SourceAdapter,
  UnitData,
} from '../../action.interface';
import { JowClient } from './jow.client';
import { JowUnit } from './jow.domain';

@Injectable()
export class JowService implements SourceAdapter {
  constructor(private readonly client: JowClient) {}

  private convertUnit(unit: JowUnit): UnitData {
    return {
      name: unit.name,
      symbols: unit.abbreviations.map((abbreviation) => ({
        name: abbreviation.label,
        factor: abbreviation.divisor,
        digits: abbreviation.digits,
        min: abbreviation.minAmount,
        max: abbreviation.maxAmount,
      })),
    };
  }

  private resolveImageUrl(path: string) {
    if (!path) return undefined;
    return new URL(path, 'https://static.jow.fr/').href;
  }

  async *listRecipes(): AsyncIterable<RecipeData> {
    const ingredients = await this.client.fetchIngredients();
    for (const ingredient of ingredients) {
      const recipeLists = await this.client.fetchRecipesFromIngredientId(
        ingredient._id,
      );
      const recipes = recipeLists.flatMap((list) => list.recipes);
      for (const { _id } of recipes) {
        const recipe = await this.client.fetchRecipe(_id);
        yield {
          name: recipe.title,
          cookingTime: recipe.cookingTime,
          preppingTime: recipe.preparationTime,
          imageUrl: this.resolveImageUrl(recipe.imageUrl),
          energy: recipe.nutritionalrating.etiquettable.calories,
          steps: recipe.directions.map((direction) => ({
            description: direction.label,
          })),
          constituents: recipe.constituents.map((constituent) => {
            const ingredient = constituent.ingredient;
            const conversions = [] satisfies ConversionData[];
            for (const alternateUnit of ingredient.alternativeUnits) {
              if (
                conversions.some((conversion) => {
                  return conversion.unit.name === alternateUnit.unit.name;
                })
              ) {
                continue;
              }
              conversions.push({
                factor: alternateUnit.quantity,
                unit: this.convertUnit(alternateUnit.unit),
              });
            }
            return {
              quantity: constituent.quantityPerCover,
              ingredient: {
                name: ingredient.name,
                imageUrl: this.resolveImageUrl(ingredient.imageUrl),
                defaultUnit: this.convertUnit(ingredient.naturalUnit),
                conversions,
              },
              unit: this.convertUnit(constituent.unit),
            };
          }),
          tags: recipe.tags.map((tag) => ({ name: tag.name })),
          tools: recipe.requiredTools.map((tool) => ({
            name: tool.name,
            imageUrl: this.resolveImageUrl(tool.imageUrl),
            trivial: tool.isDefaultChecked || !tool.isNotTrivial,
          })),
        };
      }
    }
  }
}
