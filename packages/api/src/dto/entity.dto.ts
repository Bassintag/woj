import { IsUUID } from 'class-validator';

export class EntityIdentifierDto {
  @IsUUID()
  id: string;
}
