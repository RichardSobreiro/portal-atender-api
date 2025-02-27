import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOptionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  text?: string;
}
