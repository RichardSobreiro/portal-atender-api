import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AnamnesisQuestionGroup } from './anamnesis-question-group.entity';
import { AnamnesisOption } from './anamnesis-option.entity';

@Entity('anamnesis_questions')
export class AnamnesisQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AnamnesisQuestionGroup, (group) => group.questions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  group: AnamnesisQuestionGroup;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  @Column({
    type: 'enum',
    enum: [
      'yesno',
      'text',
      'number',
      'multiple_choice',
      'dropdown',
      'date',
      'textarea',
    ],
  })
  type: string;

  @Column({ type: 'boolean', default: false })
  required: boolean;

  @OneToMany(() => AnamnesisOption, (option) => option.question, {
    cascade: true,
  })
  options: AnamnesisOption[];

  @Column({ type: 'text', nullable: true })
  answerText?: string;

  @Column({ type: 'uuid', array: true, nullable: true })
  selectedOptionIds?: string[];
}
