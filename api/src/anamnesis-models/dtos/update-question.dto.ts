import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOptionDto } from './update-option.dto';

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;

  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  @IsOptional()
  @ArrayNotEmpty()
  options?: UpdateOptionDto[];
}
