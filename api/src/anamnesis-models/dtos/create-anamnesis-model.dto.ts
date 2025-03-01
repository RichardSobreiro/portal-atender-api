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
  @IsString({ message: 'O nome do modelo deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do modelo é obrigatório.' })
  name: string;

  @IsString({ message: 'O tipo do modelo deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo do modelo é obrigatório.' })
  type: string;

  @IsOptional()
  @IsUUID('4', { message: 'O ID da empresa deve ser um UUID válido.' })
  companyId?: string | null;

  @ValidateNested({ each: true, message: 'Os grupos devem ser válidos.' })
  @Type(() => CreateQuestionGroupDto)
  @ArrayNotEmpty({ message: 'O modelo deve ter pelo menos um grupo.' })
  @ArrayMinSize(1, { message: 'O modelo deve conter pelo menos um grupo.' })
  groups: CreateQuestionGroupDto[];
}
