/** @format */

import { Expose } from 'class-transformer';
import { Phone } from '../entities/phone.entity';

export class PhoneDto {
  @Expose()
  id: string;

  @Expose()
  tipo: string;

  @Expose()
  numero: string;

  @Expose()
  favorito: boolean;

  constructor(phone: Phone) {
    Object.assign(this, phone);
  }
}
