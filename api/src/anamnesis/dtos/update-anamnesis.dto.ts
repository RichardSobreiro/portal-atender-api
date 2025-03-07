import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAnamnesisQuestionGroupDto } from './update-anamnesis-question-group.dto';

export class UpdateAnamnesisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnamnesisQuestionGroupDto)
  groups: UpdateAnamnesisQuestionGroupDto[];
}
