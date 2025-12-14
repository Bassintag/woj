import { RecipeDto } from "@woj/common/dto";

export interface MenuDto {
  recipes: RecipeDto[];
}

export interface CreateMenuDto {
  quantity: number;
  tags?: number[];
  exclude?: number[];
}
