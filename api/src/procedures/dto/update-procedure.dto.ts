/** @format */

import {
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDecimal,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateProcedureDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(7)
  color?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsDecimal()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsDecimal()
  @Min(0)
  @IsOptional()
  costEstimated?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  category?: string;

  @IsString()
  @IsOptional()
  protocol?: string;

  @IsString()
  @IsOptional()
  consentForm?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;
}
