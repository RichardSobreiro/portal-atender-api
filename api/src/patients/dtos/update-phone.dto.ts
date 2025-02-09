import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePhoneDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;

  @IsString()
  number: string;

  @IsBoolean()
  favority: boolean;
}
