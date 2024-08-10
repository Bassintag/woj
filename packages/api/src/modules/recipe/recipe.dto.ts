import { PageableQueryDto } from '../../dto/pageable-query.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetRecipePageQueryDto extends PageableQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
