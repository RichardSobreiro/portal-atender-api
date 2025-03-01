import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from './create-option.dto';

export class CreateQuestionDto {
  @IsString({ message: 'O tipo da pergunta deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo da pergunta é obrigatório.' })
  type: string;

  @IsString({ message: 'O texto da pergunta deve ser uma string.' })
  @IsNotEmpty({ message: 'O texto da pergunta é obrigatório.' })
  text: string;

  @IsBoolean({ message: 'O campo obrigatório deve ser um valor booleano.' })
  required: boolean;

  @IsInt({ message: 'A ordem deve ser um número inteiro.' })
  @Min(1, { message: 'A ordem deve ser no mínimo 1.' })
  order: number;

  @ValidateIf((obj) => obj.options !== undefined) // ✅ Only validate if options is provided
  @ValidateNested({ each: true, message: 'As opções devem ser válidas.' })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
