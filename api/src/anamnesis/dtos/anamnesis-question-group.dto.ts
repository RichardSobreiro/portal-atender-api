import { AnamnesisQuestionDto } from './anamnesis-question.dto';

export class AnamnesisQuestionGroupDto {
  id: string;
  name: string;
  questions: AnamnesisQuestionDto[];
}
