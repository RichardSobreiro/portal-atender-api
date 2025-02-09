/** @format */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  Length,
  ValidateNested,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class PhoneDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString({ message: 'O type do telefone deve ser uma string.' })
  type: string;

  @IsString({ message: 'O número do telefone deve ser uma string.' })
  @Length(10, 11, {
    message: 'O número do telefone deve ter entre 10 e 11 dígitos.',
  })
  number: string;

  @IsBoolean({
    message: 'O campo favorito deve ser preenchido.',
  })
  favorite: boolean;
}

class EmailDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString({ message: 'O type do e-mail deve ser uma string.' })
  type: string;

  @IsString({ message: 'O endereço de e-mail deve ser uma string.' })
  @IsNotEmpty({ message: 'O endereço de e-mail é obrigatório.' })
  address: string;

  @IsBoolean({
    message: 'O campo favorito deve ser preenchido.',
  })
  favorite: boolean;
}

class AddressDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString({ message: 'O tipo do endereço deve ser uma string.' })
  type: string;

  @IsString({ message: 'O CEP deve ser uma string.' })
  @Length(8, 8, { message: 'O CEP deve ter exatamente 8 dígitos.' })
  postalCode: string;

  @IsString({ message: 'A rua deve ser uma string.' })
  street: string;

  @IsString({ message: 'O número deve ser uma string.' })
  number: string;

  @IsString({ message: 'O complemento deve ser uma string.' })
  @IsOptional()
  complement?: string;

  @IsString({ message: 'O bairro deve ser uma string.' })
  neighborhood: string;

  @IsString({ message: 'A cidade deve ser uma string.' })
  city: string;

  @IsString({ message: 'O estado deve ser uma string.' })
  state: string;

  @IsString({ message: 'O país deve ser uma string.' })
  country: string;

  @IsBoolean({
    message: 'O campo favorito deve ser preenchido.',
  })
  favorite: boolean;
}

class ResponsibleDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString({ message: 'O nome do responsável deve ser uma string.' })
  name: string;

  @IsString({ message: 'A relação com o paciente deve ser uma string.' })
  relation: string;

  @IsString({ message: 'O telefone do responsável deve ser uma string.' })
  phone: string;

  @IsString({ message: 'O e-mail do responsável deve ser uma string.' })
  email: string;

  @IsString({ message: 'A profissão do responsável deve ser uma string.' })
  profession: string;

  @IsString({ message: 'O RG deve ser uma string.' })
  @IsOptional()
  idCard?: string;

  @IsString({ message: 'O CPF/CNPJ deve ser uma string.' })
  @Length(11, 14, { message: 'O CPF deve ter 11 dígitos e o CNPJ 14.' })
  cpfCnpj: string;
}

export class CreatePatientDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsDateString(
    {},
    { message: 'A data de nascimento deve estar no formato AAAA-MM-DD.' },
  )
  @IsOptional()
  birthDate?: Date;

  @IsNumber({}, { message: 'A idade deve ser um número.' })
  @IsOptional()
  age?: number;

  @IsString({ message: 'O RG deve ser uma string.' })
  @IsOptional()
  idCard?: string;

  @IsString({ message: 'O CPF/CNPJ deve ser uma string.' })
  @IsNotEmpty({ message: 'O CPF/CNPJ é obrigatório.' })
  @Length(11, 14, { message: 'O CPF deve ter 11 dígitos e o CNPJ 14.' })
  cpfCnpj: string;

  @IsString({ message: 'O Instagram deve ser uma string.' })
  @IsOptional()
  instagram?: string;

  @IsString({ message: 'A profissão deve ser uma string.' })
  @IsOptional()
  profession?: string;

  @IsString({ message: 'O local de trabalho deve ser uma string.' })
  @IsOptional()
  workplace?: string;

  @IsString({ message: 'O gênero deve ser uma string.' })
  @IsOptional()
  gender?: string;

  @IsString({ message: 'O estado civil deve ser uma string.' })
  @IsOptional()
  maritalStatus?: string;

  @IsString({ message: 'A indicação deve ser uma string.' })
  @IsOptional()
  referral?: string;

  @IsString({ message: 'As observações devem ser uma string.' })
  @IsOptional()
  observations?: string;

  @IsString({ message: 'O nome do contato de emergência deve ser uma string.' })
  @IsOptional()
  emergencyContactName?: string;

  @IsString({
    message: 'O telefone do contato de emergência deve ser uma string.',
  })
  @IsOptional()
  emergencyContactPhone?: string;

  @IsString({ message: 'O plano de saúde deve ser uma string.' })
  @IsOptional()
  healthInsurance?: string;

  @IsString({ message: 'O type sanguíneo deve ser uma string.' })
  @IsOptional()
  bloodType?: string;

  @IsArray({ message: 'Os telefones devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  phones: PhoneDto[];

  @IsArray({ message: 'Os e-mails devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  emails: EmailDto[];

  @IsArray({ message: 'Os endereços devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];

  @IsArray({ message: 'Os responsáveis devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => ResponsibleDto)
  responsibles: ResponsibleDto[];
}
