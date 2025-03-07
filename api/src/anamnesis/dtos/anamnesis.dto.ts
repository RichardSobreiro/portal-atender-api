import { AnamnesisQuestionGroupDto } from './anamnesis-question-group.dto';

export class AnamnesisDto {
  id: string;
  patientId: string;
  anamnesisModelId: string;
  createdAt: Date;
  groups: AnamnesisQuestionGroupDto[];
}
