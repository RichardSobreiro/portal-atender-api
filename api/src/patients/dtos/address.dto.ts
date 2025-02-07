/** @format */

import { Expose } from 'class-transformer';
import { Address } from '../entities/address.entity';

export class AddressDto {
  @Expose()
  id: string;

  @Expose()
  tipo: string;

  @Expose()
  cep: string;

  @Expose()
  rua: string;

  @Expose()
  numero: string;

  @Expose()
  complemento: string;

  @Expose()
  bairro: string;

  @Expose()
  cidade: string;

  @Expose()
  estado: string;

  @Expose()
  pais: string;

  @Expose()
  favorito: boolean;

  constructor(address: Address) {
    Object.assign(this, address);
  }
}
