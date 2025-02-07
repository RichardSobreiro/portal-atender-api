/** @format */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PatientQueryDto } from './dtos/patient-query.dto';
import { PatientDto } from './dtos/patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientService.create(createPatientDto);
  }

  @Get()
  async findAll(@Query() query: PatientQueryDto) {
    return await this.patientService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patientService.findOne(id);
  }

  @Patch(':id')
  async updatePatient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientDto> {
    return await this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patientService.remove(id);
  }
}
