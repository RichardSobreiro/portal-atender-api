/** @format */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { PatientRecordService } from './patient-record.service';
import { PatientRecordController } from './patient-record.controller';
import { PatientService } from '../patients/patient.service';
import { Patient } from '../patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientRecord, Patient])],
  providers: [PatientRecordService, PatientService],
  controllers: [PatientRecordController],
})
export class PatientRecordModule {}
