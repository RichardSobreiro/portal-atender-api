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

export class ProcedureDto {
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(7)
  color: string;

  @IsInt()
  @Min(0)
  duration: number;

  @IsDecimal()
  @Min(0)
  price: number;

  @IsDecimal()
  @Min(0)
  costEstimated: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  @MaxLength(255)
  category: string;

  @IsString()
  @IsOptional()
  protocol?: string;

  @IsString()
  @IsOptional()
  consentForm?: string;

  @IsUUID()
  @IsOptional() // Nullable because some procedures may not be linked to a company
  companyId?: string;
}
