/** @format */

import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class UpdateProcedureDto {
  @IsString({ message: 'O nome do procedimento deve ser uma string válida.' })
  @MaxLength(255, {
    message: 'O nome do procedimento não pode exceder 255 caracteres.',
  })
  name: string;

  @IsString({ message: 'A cor deve ser um valor hexadecimal válido.' })
  @MaxLength(7, {
    message: 'A cor deve estar no formato hexadecimal (ex: #FFFFFF).',
  })
  color: string;

  @IsInt({ message: 'A duração deve ser um número inteiro.' })
  @Min(0, { message: 'A duração não pode ser negativa.' })
  duration: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'O preço deve ser um número decimal válido.' })
  @Min(0, { message: 'O preço deve ser maior ou igual a 0.' })
  price: number;

  @Type(() => Number)
  @IsNumber(
    {},
    { message: 'O custo estimado deve ser um número decimal válido.' },
  )
  @Min(0, { message: 'O custo estimado deve ser maior ou igual a 0.' })
  costEstimated: number;

  @IsString({ message: 'A descrição deve ser uma string válida.' })
  @IsOptional()
  description?: string;

  @IsBoolean({
    message: 'O campo "ativo" deve ser um valor booleano (true ou false).',
  })
  @IsOptional()
  active?: boolean;

  @IsString({ message: 'A categoria deve ser uma string válida.' })
  @MaxLength(255, { message: 'A categoria não pode exceder 255 caracteres.' })
  category: string;

  @IsString({ message: 'O protocolo deve ser uma string válida.' })
  @IsOptional()
  protocol?: string;

  @IsString({ message: 'O termo de consentimento deve ser uma string válida.' })
  @IsOptional()
  consentForm?: string;

  @IsUUID('4', { message: 'O ID da empresa deve ser um UUID válido.' })
  @IsOptional()
  companyId?: string;
}
