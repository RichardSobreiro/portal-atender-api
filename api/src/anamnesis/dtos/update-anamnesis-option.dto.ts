import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnamnesisOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
