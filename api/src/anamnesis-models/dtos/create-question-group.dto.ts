import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';

export class CreateQuestionGroupDto {
  @IsString({ message: 'O nome do grupo deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do grupo é obrigatório.' })
  name: string;

  @ValidateNested({ each: true, message: 'As perguntas devem ser válidas.' })
  @Type(() => CreateQuestionDto)
  @ArrayNotEmpty({ message: 'O grupo deve conter pelo menos uma pergunta.' })
  @ArrayMinSize(1, { message: 'O grupo deve ter no mínimo uma pergunta.' })
  questions: CreateQuestionDto[];
}
