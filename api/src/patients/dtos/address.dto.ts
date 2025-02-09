/** @format */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsUUID,
} from 'class-validator';

export class AddressDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;

  @IsString()
  @Length(8, 8)
  postalCode: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsNotEmpty()
  favorite: boolean;
}
