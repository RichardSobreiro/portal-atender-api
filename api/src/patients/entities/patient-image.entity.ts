/** @format */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Entity('patient_images')
export class PatientImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.images, {
    onDelete: 'CASCADE',
  })
  patient: Patient;

  @Column({ type: 'varchar', length: 255 })
  originalName: string; // Stores the original file name

  @Column({ type: 'varchar', length: 10 })
  fileType: string; // File extension (jpg, png, etc.)

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean; // Flag to indicate if the image was deleted from storage

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null; // Stores the deletion timestamp

  @CreateDateColumn()
  createdAt: Date;
}
