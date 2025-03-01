import {
  IsString,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOptionDto } from './update-option.dto';

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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
  @Type(() => UpdateOptionDto)
  options?: UpdateOptionDto[];
}
