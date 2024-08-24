import { Recipe } from "@/features/recipe/domain/Recipe";
import { ShoppingItem } from "@/features/shoppingList/domain/ShoppingItem";

export interface ShoppingList {
  id: string;
  createdAt: string;
  recipes: Recipe[];
  items: ShoppingItem[];
}
