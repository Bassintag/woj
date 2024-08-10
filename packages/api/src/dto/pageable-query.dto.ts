import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageableQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  size: number;
}
