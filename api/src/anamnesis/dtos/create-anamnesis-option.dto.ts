import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnamnesisOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
