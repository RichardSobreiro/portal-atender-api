import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index() // Indexed for fast lookup by email
  address: string;

  @Column({ type: 'boolean', default: false })
  favorite: boolean;

  @ManyToOne(() => Patient, (patient) => patient.emails, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
