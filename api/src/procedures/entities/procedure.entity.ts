/** @format */

import { Company } from 'src/auth/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('procedures') // Defines table name
export class Procedure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 7 }) // HEX color format (#RRGGBB)
  color: string;

  @Column({ type: 'int', default: 0 }) // Duration in minutes
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // Currency format
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // Currency format
  costEstimated: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'text', nullable: true })
  protocol: string;

  @Column({ type: 'text', nullable: true })
  consentForm: string;

  @ManyToOne(() => Company, { nullable: true })
  company: Company; // Can be null if it's a default procedure
}
