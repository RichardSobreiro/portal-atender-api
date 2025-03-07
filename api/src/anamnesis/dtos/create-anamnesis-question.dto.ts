import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnamnesisOptionDto } from './create-anamnesis-option.dto';

export class CreateAnamnesisQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum([
    'yesno',
    'text',
    'number',
    'multiple_choice',
    'dropdown',
    'date',
    'textarea',
  ])
  type: string;

  @IsBoolean()
  required: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnamnesisOptionDto)
  options?: CreateAnamnesisOptionDto[];

  @IsUUID('all', { each: true })
  selectedOptionIds?: string[];

  @IsString()
  answerText?: string;
}
