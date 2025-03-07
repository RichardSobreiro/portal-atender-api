import { IsUUID, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnamnesisQuestionGroupDto } from './create-anamnesis-question-group.dto';

export class CreateAnamnesisDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  anamnesisModelId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnamnesisQuestionGroupDto)
  groups: CreateAnamnesisQuestionGroupDto[];
}
