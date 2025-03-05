/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { CreatePatientRecordDto } from './dtos/create-patient-record.dto';
import { PatientRecordDto } from './dtos/patient-record.dto';
import { PatientService } from '../patients/patient.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PatientRecordService {
  constructor(
    @InjectRepository(PatientRecord)
    private readonly patientRecordRepository: Repository<PatientRecord>,
    private readonly patientService: PatientService, // Inject PatientService to validate patients
  ) {}

  async create(
    dto: CreatePatientRecordDto,
    companyId: string,
  ): Promise<PatientRecordDto> {
    // Validate if patient exists
    const patient = await this.patientService.findOne(dto.patientId, companyId);
    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const record = this.patientRecordRepository.create({
      patient,
      content: dto.content,
    });

    const savedRecord = await this.patientRecordRepository.save(record);
    return plainToInstance(PatientRecordDto, savedRecord, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByPatient(patientId: string): Promise<PatientRecordDto[]> {
    const records = await this.patientRecordRepository.find({
      where: { patient: { id: patientId } },
      order: { createdAt: 'DESC' }, // Latest records first
    });

    return plainToInstance(PatientRecordDto, records, {
      excludeExtraneousValues: true,
    });
  }
}
