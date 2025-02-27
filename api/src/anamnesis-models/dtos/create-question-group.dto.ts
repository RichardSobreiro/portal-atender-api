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
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  questions: CreateQuestionDto[];
}
