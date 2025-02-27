import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { QuestionGroup } from './question-group.entity';
import { Option } from './option.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  text: string;

  @Column({ default: false })
  required: boolean;

  @Column()
  order: number;

  @ManyToOne(() => QuestionGroup, (group) => group.questions, {
    onDelete: 'CASCADE',
  })
  group: QuestionGroup;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];
}
