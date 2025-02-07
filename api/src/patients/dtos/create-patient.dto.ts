/** @format */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  Length,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class PhoneDto {
  @IsString()
  tipo: string;

  @IsString()
  @Length(10, 11)
  numero: string;

  @IsBoolean()
  favorito: boolean;
}

class EmailDto {
  @IsString()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsBoolean()
  favorito: boolean;
}

class AddressDto {
  @IsString()
  tipo: string;

  @IsString()
  @Length(8, 8)
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

class ResponsibleDto {
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
  @Length(11, 14)
  cpfCnpj: string;
}

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsDateString()
  @IsOptional()
  dataNascimento?: Date;

  @IsNumber()
  @IsOptional()
  idade?: number;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  cpfCnpj: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  profissao?: string;

  @IsString()
  @IsOptional()
  localTrabalho?: string;

  @IsString()
  @IsOptional()
  genero?: string;

  @IsString()
  @IsOptional()
  estadoCivil?: string;

  @IsString()
  @IsOptional()
  indicacao?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  emergencyName?: string;

  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @IsString()
  @IsOptional()
  healthPlan?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  telefones: PhoneDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  emails: EmailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  enderecos: AddressDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponsibleDto)
  responsaveis: ResponsibleDto[];
}
