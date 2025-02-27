import { OptionDto } from './option.dto';

export class QuestionDto {
  id: string;
  type: string;
  text: string;
  required: boolean;
  order: number;
  options?: OptionDto[];
}
