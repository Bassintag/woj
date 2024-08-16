import { Recipe } from "@/features/recipe/domain/Recipe";

export interface CartItem {
  quantity: number;
  recipe: Recipe;
}
