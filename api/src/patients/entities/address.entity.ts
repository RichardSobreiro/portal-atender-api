import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'varchar', length: 10 })
  @Index() // Indexed for fast lookup by ZIP code
  cep: string;

  @Column({ type: 'varchar', length: 255 })
  rua: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complemento: string;

  @Column({ type: 'varchar', length: 255 })
  bairro: string;

  @Column({ type: 'varchar', length: 255 })
  cidade: string;

  @Column({ type: 'varchar', length: 50 })
  estado: string;

  @Column({ type: 'varchar', length: 50 })
  pais: string;

  @Column({ type: 'boolean', default: false })
  favorito: boolean;

  @ManyToOne(() => Patient, (patient) => patient.enderecos, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
