import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateResponsibleDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  relation: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  profession: string;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsString()
  cpfCnpj: string;
}
