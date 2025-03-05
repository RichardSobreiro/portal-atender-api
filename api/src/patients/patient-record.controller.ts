/** @format */

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PatientRecordService } from './patient-record.service';
import { CreatePatientRecordDto } from './dtos/create-patient-record.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PatientRecordDto } from './dtos/patient-record.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Controller('patient-records')
@UseGuards(JwtAuthGuard)
export class PatientRecordController {
  constructor(private readonly patientRecordService: PatientRecordService) {}

  @Post()
  async create(
    @Body() dto: CreatePatientRecordDto,
    @AuthUser() user,
  ): Promise<PatientRecordDto> {
    return await this.patientRecordService.create(dto, user.companyId);
  }

  @Get(':patientId')
  async findAllByPatient(
    @Param('patientId') patientId: string,
  ): Promise<PatientRecordDto[]> {
    return await this.patientRecordService.findAllByPatient(patientId);
  }
}
