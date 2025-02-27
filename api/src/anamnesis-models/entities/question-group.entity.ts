import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AnamnesisModel } from './anamnesis-model.entity';
import { Question } from './question.entity';

@Entity('question_groups')
export class QuestionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => AnamnesisModel, (anamnesisModel) => anamnesisModel.groups, {
    onDelete: 'CASCADE',
  })
  anamnesisModel: AnamnesisModel;

  @OneToMany(() => Question, (question) => question.group, { cascade: true })
  questions: Question[];
}
