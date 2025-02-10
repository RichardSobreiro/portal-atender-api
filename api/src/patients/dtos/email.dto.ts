/** @format */

import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class EmailDto {
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

  constructor(email: Partial<EmailDto>) {
    Object.assign(this, email);
  }
}
