import { IsInt } from 'class-validator';

export class EntityIdentifierDto {
  @IsInt()
  id: number;
}
