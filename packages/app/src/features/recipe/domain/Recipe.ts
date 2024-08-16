import { Entity } from "@/domain/Entity";
import { PageableQuery } from "@/domain/Page";
import { Tag } from "@/features/tag/domain/Tag";

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
  tags: Tag[];
}

export interface Step extends Entity {
  description: string;
}

export interface RecipeIngredient extends Entity {
  quantity: number;
  ingredient: Ingredient;
}

export interface Unit extends Entity {
  name: string;
  symbols: Symbol[];
}

export interface Symbol extends Entity {
  name: string;
  factor: number;
  digits: number;
  min?: number;
  max?: number;
}

export interface Ingredient extends Entity {
  name: string;
  imagePath?: string;
  energy?: number;
  unit: Unit;
}
