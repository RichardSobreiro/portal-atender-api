import {
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateQuestionDto } from './update-question.dto';

export class UpdateQuestionGroupDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString({ message: 'O nome do grupo deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do grupo é obrigatório.' })
  name: string;

  @ValidateNested({ each: true, message: 'As perguntas devem ser válidas.' })
  @Type(() => UpdateQuestionDto)
  @ArrayNotEmpty({ message: 'O grupo deve conter pelo menos uma pergunta.' })
  @ArrayMinSize(1, { message: 'O grupo deve ter no mínimo uma pergunta.' })
  questions?: UpdateQuestionDto[];
}
