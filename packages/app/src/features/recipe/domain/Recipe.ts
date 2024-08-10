import { Entity } from "@/domain/Entity";
import { PageableQuery } from "@/domain/Page";

export interface GetRecipePageQuery extends PageableQuery {
  search?: string;
}

export interface Recipe extends Entity {
  name: string;
  imagePath?: string;
  preppingTime?: number;
  cookingTime?: number;
  steps: Step[];
  ingredients: RecipeIngredient[];
}

export interface Step extends Entity {
  description: string;
}

export interface RecipeIngredient extends Entity {
  quantity: number;
  unit: Unit;
  ingredient: Ingredient;
}

export interface Unit extends Entity {
  name: string;
  symbol: string;
}

export interface Ingredient extends Entity {
  name: string;
  imagePath?: string;
  energy?: number;
}
