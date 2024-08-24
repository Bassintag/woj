import { Ingredient } from "@/features/recipe/domain/Recipe";

export interface ShoppingItem {
  id: string;
  name: string;
  purchased: boolean;
  ingredient?: Ingredient;
}
