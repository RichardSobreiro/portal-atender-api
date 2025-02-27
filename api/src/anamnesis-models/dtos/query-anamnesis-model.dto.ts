/** @format */

import { IsOptional, IsInt, Min, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAnamnesisModelDto {
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
