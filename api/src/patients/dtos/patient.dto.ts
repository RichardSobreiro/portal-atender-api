/** @format */

import { Patient } from '../entities/patient.entity';
import { Expose, Type } from 'class-transformer';
import { PhoneDto } from './phone.dto';
import { EmailDto } from './email.dto';
import { AddressDto } from './address.dto';
import { ResponsibleDto } from './responsible.dto';

export class PatientDto {
  @Expose()
  id: string;

  @Expose()
  nome: string;

  @Expose()
  dataNascimento: string;

  @Expose()
  idade: number;

  @Expose()
  rg: string;

  @Expose()
  cpfCnpj: string;

  @Expose()
  instagram: string;

  @Expose()
  profissao: string;

  @Expose()
  localTrabalho: string;

  @Expose()
  genero: string;

  @Expose()
  estadoCivil: string;

  @Expose()
  indicacao: string;

  @Expose()
  observacoes: string;

  @Expose()
  emergencyName: string;

  @Expose()
  emergencyPhone: string;

  @Expose()
  healthPlan: string;

  @Expose()
  bloodType: string;

  @Expose()
  @Type(() => PhoneDto)
  telefones: PhoneDto[];

  @Expose()
  @Type(() => EmailDto)
  emails: EmailDto[];

  @Expose()
  @Type(() => AddressDto)
  enderecos: AddressDto[];

  @Expose()
  @Type(() => ResponsibleDto)
  responsaveis: ResponsibleDto[];

  constructor(patient: Patient) {
    Object.assign(this, patient);
  }
}
