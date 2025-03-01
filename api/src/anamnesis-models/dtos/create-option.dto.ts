import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOptionDto {
  @IsString({ message: 'O texto da opção deve ser uma string.' })
  @IsNotEmpty({ message: 'O texto da opção é obrigatório.' })
  text: string;
}
