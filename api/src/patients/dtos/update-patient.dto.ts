/** @format */

import {
  IsString,
  IsOptional,
  IsUUID,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePhoneDto } from './update-phone.dto';
import { UpdateEmailDto } from './update-email.dto';
import { UpdateAddressDto } from './update-address.dto';
import { UpdateResponsibleDto } from './update-responsible.dto';

export class UpdatePatientDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  nome?: string;

  @IsDate()
  @IsOptional()
  dataNascimento?: Date;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsString()
  @IsOptional()
  cpfCnpj?: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePhoneDto)
  telefones?: UpdatePhoneDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmailDto)
  emails?: UpdateEmailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  enderecos?: UpdateAddressDto[];

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
  @Type(() => UpdateResponsibleDto)
  responsaveis?: UpdateResponsibleDto[];
}
