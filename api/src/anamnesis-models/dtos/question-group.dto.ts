import { QuestionDto } from './question.dto';

export class QuestionGroupDto {
  id: string;
  name: string;
  questions: QuestionDto[];
}
