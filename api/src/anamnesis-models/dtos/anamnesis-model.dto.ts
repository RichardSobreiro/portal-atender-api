import { QuestionGroupDto } from './question-group.dto';

export class AnamnesisModelDto {
  id: string;
  name: string;
  type: string;
  companyId?: string | null;
  groups: QuestionGroupDto[];
}
