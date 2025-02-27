import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from './create-option.dto';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  required: boolean;

  @IsInt()
  @Min(1)
  order: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @IsOptional()
  @ArrayNotEmpty()
  options?: CreateOptionDto[];
}
