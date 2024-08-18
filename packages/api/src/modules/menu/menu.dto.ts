import { IsArray, IsOptional, IsInt, Max, Min } from 'class-validator';

export class CreateMenuDto {
  @IsInt()
  @Min(1)
  @Max(50)
  quantity: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  exclude?: number[];
}
