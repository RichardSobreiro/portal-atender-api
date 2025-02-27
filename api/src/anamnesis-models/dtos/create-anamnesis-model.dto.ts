import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionGroupDto } from './create-question-group.dto';

export class CreateAnamnesisModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsUUID()
  companyId?: string | null;

  @ValidateNested({ each: true })
  @Type(() => CreateQuestionGroupDto)
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  groups: CreateQuestionGroupDto[];
}
