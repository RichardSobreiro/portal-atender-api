import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class UpdateAnamnesisQuestionDto {
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

  @IsUUID('all', { each: true })
  selectedOptionIds?: string[];

  @IsString()
  answerText?: string;
}
