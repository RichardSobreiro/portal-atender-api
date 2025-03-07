import { IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAnamnesisQuestionDto } from './update-anamnesis-question.dto';

export class UpdateAnamnesisQuestionGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnamnesisQuestionDto)
  questions: UpdateAnamnesisQuestionDto[];
}
