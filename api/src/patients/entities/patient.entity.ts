/** @format */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Phone } from './phone.entity';
import { Email } from './email.entity';
import { Address } from './address.entity';
import { Responsible } from './responsible.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index() // Indexed for searching patients by name
  name: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  @Index() // Indexed for fast lookup by RG
  idCard: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  @Index() // Indexed for fast lookup by CPF/CNPJ
  cpfCnpj: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profession: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  workplace: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  maritalStatus: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referral: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContactName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  healthInsurance: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  bloodType: string;

  @OneToMany(() => Phone, (phone) => phone.patient, { cascade: true })
  phones: Phone[];

  @OneToMany(() => Email, (email) => email.patient, { cascade: true })
  emails: Email[];

  @OneToMany(() => Address, (address) => address.patient, { cascade: true })
  addresses: Address[];

  @OneToMany(() => Responsible, (responsible) => responsible.patient, {
    cascade: true,
  })
  responsibles: Responsible[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
