import { IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnamnesisQuestionDto } from './create-anamnesis-question.dto';

export class CreateAnamnesisQuestionGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnamnesisQuestionDto)
  questions: CreateAnamnesisQuestionDto[];
}
