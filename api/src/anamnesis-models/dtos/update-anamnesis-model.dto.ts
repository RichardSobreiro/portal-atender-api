import {
  IsOptional,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateQuestionGroupDto } from './update-question-group.dto';

export class UpdateAnamnesisModelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsUUID()
  companyId?: string | null;

  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionGroupDto)
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  groups?: UpdateQuestionGroupDto[];
}
