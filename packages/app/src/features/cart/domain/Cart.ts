import { RecipeDto } from "@woj/common/dto";

export interface CartItemDto {
  quantity: number;
  recipe: RecipeDto;
}
