import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { QuestionGroup } from './question-group.entity';
import { Company } from 'src/auth/entities/company.entity';

@Entity('anamnesis_models')
export class AnamnesisModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'CASCADE' })
  company?: Company;

  @OneToMany(() => QuestionGroup, (group) => group.anamnesisModel, {
    cascade: true,
  })
  groups: QuestionGroup[];
}
