import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('phones')
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'varchar', length: 20 })
  @Index() // Indexed for fast lookup by phone number
  numero: string;

  @Column({ type: 'boolean', default: false })
  favorito: boolean;

  @ManyToOne(() => Patient, (patient) => patient.telefones, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
