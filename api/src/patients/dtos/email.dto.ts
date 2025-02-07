/** @format */

import { Expose } from 'class-transformer';
import { Email } from '../entities/email.entity';

export class EmailDto {
  @Expose()
  id: string;

  @Expose()
  tipo: string;

  @Expose()
  endereco: string;

  @Expose()
  favorito: boolean;

  constructor(email: Email) {
    Object.assign(this, email);
  }
}
