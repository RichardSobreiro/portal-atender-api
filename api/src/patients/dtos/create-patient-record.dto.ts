/** @format */

import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreatePatientRecordDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
