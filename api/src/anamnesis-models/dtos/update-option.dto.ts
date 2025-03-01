import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOptionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString({ message: 'O texto da opção deve ser uma string.' })
  @IsNotEmpty({ message: 'O texto da opção é obrigatório.' })
  text: string;
}
