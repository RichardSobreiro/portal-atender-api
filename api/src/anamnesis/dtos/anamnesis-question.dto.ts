import { AnamnesisOptionDto } from './anamnesis-option.dto';

export class AnamnesisQuestionDto {
  id: string;
  text: string;
  type: string;
  required: boolean;
  options?: AnamnesisOptionDto[];
  selectedOptionIds?: string[];
  answerText?: string;
}
