import { IngredientDto } from "@woj/common/dto";

export interface ShoppingItemDto {
  id: string;
  name: string;
  purchased: boolean;
  ingredient?: IngredientDto;
}
