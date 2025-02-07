import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  tipo: string;

  @IsString()
  cep: string;

  @IsString()
  rua: string;

  @IsString()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsString()
  pais: string;

  @IsBoolean()
  favorito: boolean;
}
