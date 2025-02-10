/** @format */

import { Expose, Type } from 'class-transformer';
import { PhoneDto } from './phone.dto';
import { EmailDto } from './email.dto';
import { AddressDto } from './address.dto';
import { ResponsibleDto } from './responsible.dto';

export class PatientDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  birthDate: Date;

  @Expose()
  age: number;

  @Expose()
  idCard: string;

  @Expose()
  cpfCnpj: string;

  @Expose()
  instagram: string;

  @Expose()
  profession: string;

  @Expose()
  workplace: string;

  @Expose()
  gender: string;

  @Expose()
  maritalStatus: string;

  @Expose()
  referral: string;

  @Expose()
  observations: string;

  @Expose()
  emergencyContactName: string;

  @Expose()
  emergencyContactPhone: string;

  @Expose()
  healthInsurance: string;

  @Expose()
  bloodType: string;

  @Expose()
  @Type(() => PhoneDto)
  phones: PhoneDto[] = [];

  @Expose()
  @Type(() => EmailDto)
  emails: EmailDto[] = [];

  @Expose()
  @Type(() => AddressDto)
  addresses: AddressDto[];

  @Expose()
  @Type(() => ResponsibleDto)
  responsibles: ResponsibleDto[];

  constructor(patient: PatientDto) {
    Object.assign(this, patient);
  }
}
