import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class UpdateEmailDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  tipo: string;

  @IsString()
  endereco: string;

  @IsBoolean()
  favorito: boolean;
}
