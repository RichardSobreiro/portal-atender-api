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
import { AuthUser } from '../auth/auth-user.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@AuthUser() user, @Body() createPatientDto: CreatePatientDto) {
    return await this.patientService.create(createPatientDto, user.companyId);
  }

  @Get()
  async findAll(@AuthUser() user, @Query() query: PatientQueryDto) {
    return await this.patientService.findAll(query, user.companyId);
  }

  @Get('search')
  async searchPatients(@AuthUser() user, @Query('name') name: string) {
    return await this.patientService.searchPatients(name, user.companyId);
  }

  @Get(':id')
  async findOne(@AuthUser() user, @Param('id') id: string) {
    return await this.patientService.findOne(id, user.companyId);
  }

  @Patch(':id')
  async updatePatient(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientDto> {
    return await this.patientService.update(
      id,
      updatePatientDto,
      user.companyId,
    );
  }

  @Delete(':id')
  async remove(@AuthUser() user, @Param('id') id: string) {
    return await this.patientService.remove(id, user.companyId);
  }
}
