import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Anamnesis } from './anamnesis.entity';
import { AnamnesisQuestion } from './anamnesis-question.entity';

@Entity('anamnesis_question_groups')
export class AnamnesisQuestionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Anamnesis, (anamnesis) => anamnesis.groups, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  anamnesis: Anamnesis;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => AnamnesisQuestion, (question) => question.group, {
    cascade: true,
  })
  questions: AnamnesisQuestion[];
}
