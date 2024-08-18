import { Recipe } from "@/features/recipe/domain/Recipe";

export interface Menu {
  recipes: Recipe[];
}

export interface CreateMenu {
  quantity: number;
  tags?: number[];
  exclude?: number[];
}
