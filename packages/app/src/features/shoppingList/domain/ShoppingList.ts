import { Entity } from "@/domain/Entity";
import { PageableQuery } from "@/domain/Page";
import { Recipe } from "@/features/recipe/domain/Recipe";
import { ShoppingItem } from "@/features/shoppingList/domain/ShoppingItem";

export interface GetShoppingListPageQuery extends PageableQuery {}

export interface ShoppingList extends Entity {
  createdAt: string;
  recipes: Recipe[];
  items: ShoppingItem[];
}

export interface CreateShoppingList {
  recipes: CreateShoppingListRecipe[];
}

export interface CreateShoppingListRecipe extends Entity {
  quantity: number;
}
