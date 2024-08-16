import { IsArray, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateMenuDto {
  @IsInt()
  @Min(1)
  @Max(50)
  quantity: number;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  exclude?: string[];
}
