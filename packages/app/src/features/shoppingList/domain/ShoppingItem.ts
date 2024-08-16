import { Entity } from "@/domain/Entity";
import { Ingredient } from "@/features/recipe/domain/Recipe";

export interface ShoppingItem extends Entity {
  name: string;
  purchased: boolean;
  ingredient?: Ingredient;
}

export interface CreateShoppingItem extends Omit<ShoppingItem, "id"> {}

export interface UpdateShoppingItem extends Partial<ShoppingItem> {}

export interface SetShoppingItemIndex {
  index: number;
}
