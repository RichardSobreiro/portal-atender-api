/** @format */

import { IsString, IsOptional, Length, IsUUID } from 'class-validator';

export class ResponsibleDto {
  @IsUUID()
  @IsOptional()
  id?: string;

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
  idCard?: string;

  @IsString()
  @Length(11, 14)
  cpfCnpj: string;
}
