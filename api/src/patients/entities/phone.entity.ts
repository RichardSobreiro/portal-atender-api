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
  type: string;

  @Column({ type: 'varchar', length: 20 })
  @Index() // Indexed for fast lookup by phone number
  number: string;

  @Column({ type: 'boolean', default: false })
  favorite: boolean;

  @ManyToOne(() => Patient, (patient) => patient.phones, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
