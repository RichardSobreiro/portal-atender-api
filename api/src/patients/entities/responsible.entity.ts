import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('responsibles')
export class Responsible {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  relation: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  profession: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  idCard: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Index() // Indexed for fast lookup by CPF/CNPJ
  cpfCnpj: string;

  @ManyToOne(() => Patient, (patient) => patient.responsibles, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
