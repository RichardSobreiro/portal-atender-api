/** @format */

import { Expose, Type } from 'class-transformer';
import { PatientDto } from '../../patients/dtos/patient.dto';

export class PatientRecordDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => PatientDto)
  patient: PatientDto;
}
