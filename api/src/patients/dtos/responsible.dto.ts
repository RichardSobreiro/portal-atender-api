/** @format */

import { Expose } from 'class-transformer';
import { Responsible } from '../entities/responsible.entity';

export class ResponsibleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  relation: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  profession: string;

  @Expose()
  rg: string;

  @Expose()
  cpfCnpj: string;

  constructor(responsible: Responsible) {
    Object.assign(this, responsible);
  }
}
