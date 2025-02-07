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
  nome: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento: Date;

  @Column({ type: 'int', nullable: true })
  idade: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  @Index() // Indexed for fast lookup by RG
  rg: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  @Index() // Indexed for fast lookup by CPF/CNPJ
  cpfCnpj: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profissao: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  localTrabalho: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  genero: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estadoCivil: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  indicacao: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  healthPlan: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  bloodType: string;

  @OneToMany(() => Phone, (phone) => phone.patient, { cascade: true })
  telefones: Phone[];

  @OneToMany(() => Email, (email) => email.patient, { cascade: true })
  emails: Email[];

  @OneToMany(() => Address, (address) => address.patient, { cascade: true })
  enderecos: Address[];

  @OneToMany(() => Responsible, (responsible) => responsible.patient, {
    cascade: true,
  })
  responsaveis: Responsible[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
