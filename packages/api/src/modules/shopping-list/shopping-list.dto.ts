import { EntityIdentifierDto } from '../../dto/entity.dto';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageableQueryDto } from '../../dto/pageable-query.dto';
import { PartialType } from '@nestjs/mapped-types';

export class GetShoppingListPageQueryDto extends PageableQueryDto {}

export class CreateShoppingListDto {
  @IsArray()
  @Type(() => CreateShoppingListRecipeDto)
  @ValidateNested({ each: true })
  recipes: CreateShoppingListRecipeDto[];
}

export class CreateShoppingListRecipeDto extends EntityIdentifierDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateShoppingListItemDto {
  @IsUUID()
  @IsOptional()
  ingredientId?: string;

  @IsString()
  name: string;

  @IsBoolean()
  purchased: boolean;
}

export class UpdateShoppingItemDto extends PartialType(
  CreateShoppingListItemDto,
) {}

export class SetShoppingItemIndexDto {
  @IsInt()
  @Min(0)
  index: number;
}
