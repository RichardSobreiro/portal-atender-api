import {
  IsOptional,
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

  @IsString()
  @IsOptional()
  name?: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  questions?: UpdateQuestionDto[];
}
