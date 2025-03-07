import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { AnamnesisModel } from '../../anamnesis-models/entities/anamnesis-model.entity';
import { AnamnesisQuestionGroup } from './anamnesis-question-group.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('anamnesis')
export class Anamnesis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, { nullable: false, onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => AnamnesisModel, { nullable: false })
  anamnesisModel: AnamnesisModel;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' }) // ✅ Professional responsible
  professional: User;

  @OneToMany(() => AnamnesisQuestionGroup, (group) => group.anamnesis, {
    cascade: true,
  })
  groups: AnamnesisQuestionGroup[];

  @CreateDateColumn()
  createdAt: Date;
}
