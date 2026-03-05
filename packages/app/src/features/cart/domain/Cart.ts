import { RecipeDetailsDto } from "@woj/common/dto";

export interface CartItemDto {
  quantity: number;
  recipe: RecipeDetailsDto;
}
