import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePhoneDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  tipo: string;

  @IsString()
  numero: string;

  @IsBoolean()
  favorito: boolean;
}
