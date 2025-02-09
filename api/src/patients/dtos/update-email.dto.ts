/** @format */

import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateEmailDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsBoolean()
  favorite: boolean;
}
