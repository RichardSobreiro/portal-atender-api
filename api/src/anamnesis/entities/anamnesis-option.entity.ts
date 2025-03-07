import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AnamnesisQuestion } from './anamnesis-question.entity';

@Entity('anamnesis_options')
export class AnamnesisOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AnamnesisQuestion, (question) => question.options, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  question: AnamnesisQuestion;

  @Column({ type: 'varchar', length: 255 })
  text: string;
}
