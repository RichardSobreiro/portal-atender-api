/** @format */

import {
  IsString,
  IsBoolean,
  Length,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class PhoneDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;

  @IsString()
  @Length(10, 11)
  number: string;

  @IsBoolean()
  favorite: boolean;
}
