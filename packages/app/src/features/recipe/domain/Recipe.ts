import { Entity } from "@/domain/Entity";

export interface Recipe extends Entity {
  name: string;
  preppingTime?: number;
  cookingTime?: number;
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
}

export interface RecipeStep extends Entity {
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
  energy?: number;
}
