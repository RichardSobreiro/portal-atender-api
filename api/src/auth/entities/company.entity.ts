/** @format */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: false, nullable: true })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
