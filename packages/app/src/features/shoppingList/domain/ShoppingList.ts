import { ShoppingItemDto } from "@/features/shoppingList/domain/ShoppingItem";
import { RecipeDto } from "@woj/common/dto";

export interface ShoppingListDto {
  id: string;
  createdAt: string;
  recipes: RecipeDto[];
  items: ShoppingItemDto[];
}
