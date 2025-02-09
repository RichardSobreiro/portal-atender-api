/** @format */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { PatientQueryDto } from './dtos/patient-query.dto';
import { PatientDto } from './dtos/patient.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientDto> {
    if (createPatientDto.idCard) {
      const existingRg = await this.patientRepository.findOne({
        where: { idCard: createPatientDto.idCard },
      });

      if (existingRg) {
        throw new ConflictException('Já existe um paciente com este RG.');
      }
    }

    const existingCpfCnpj = await this.patientRepository.findOne({
      where: { cpfCnpj: createPatientDto.cpfCnpj },
    });

    if (existingCpfCnpj) {
      throw new ConflictException('Já existe um paciente com este CPF/CNPJ.');
    }

    try {
      const newPatient = this.patientRepository.create(createPatientDto);
      const savedPatient = await this.patientRepository.save(newPatient);

      return plainToInstance(PatientDto, savedPatient, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('CPF/CNPJ ou RG já cadastrado.');
      }
      throw new BadRequestException('Erro ao cadastrar paciente.');
    }
  }

  async findAll(query: PatientQueryDto) {
    const { page = 1, limit = 10, searchTerm, state } = query;
    const skip = (page - 1) * limit;

    const queryBuilder: SelectQueryBuilder<Patient> = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.phones', 'phones')
      .leftJoinAndSelect('patient.emails', 'emails')
      .leftJoinAndSelect('patient.addresses', 'addresses');

    if (searchTerm) {
      queryBuilder.andWhere(
        `(LOWER(patient.name) LIKE LOWER(:searchTerm) OR 
          LOWER(patient.cpfCnpj) LIKE LOWER(:searchTerm) OR 
          LOWER(phones.number) LIKE LOWER(:searchTerm) OR 
          LOWER(emails.address) LIKE LOWER(:searchTerm))`,
        { searchTerm: `%${searchTerm}%` },
      );
    }

    if (state) {
      queryBuilder.andWhere('addresses.state = :state', { state });
    }

    queryBuilder.skip(skip).take(limit);

    // Fetch the results
    const [patients, total] = await queryBuilder.getManyAndCount();

    // Explicitly ensure that phones and emails are returned
    const formattedPatients = patients.map((patient) => ({
      ...patient,
      phones: patient.phones ?? [], // Ensure it is not undefined
      emails: patient.emails ?? [], // Ensure it is not undefined
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: formattedPatients,
    };
  }

  async findOne(id: string): Promise<PatientDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['phones', 'emails', 'addresses', 'responsibles'], // Fixed from relationships → relations
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    return plainToInstance(PatientDto, patient, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['phones', 'emails', 'addresses', 'responsibles'], // Fixed relationships → relations
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }

    // Check if CPF/CNPJ is being updated and already exists
    if (
      updatePatientDto.cpfCnpj &&
      updatePatientDto.cpfCnpj !== patient.cpfCnpj
    ) {
      const existingCpfCnpj = await this.patientRepository.findOne({
        where: { cpfCnpj: updatePatientDto.cpfCnpj },
      });

      if (existingCpfCnpj) {
        throw new ConflictException('Já existe um paciente com este CPF/CNPJ.');
      }
    }

    // Check if RG is being updated and already exists
    if (updatePatientDto.idCard && updatePatientDto.idCard !== patient.idCard) {
      const existingRg = await this.patientRepository.findOne({
        where: { idCard: updatePatientDto.idCard },
      });

      if (existingRg) {
        throw new ConflictException('Já existe um paciente com este RG.');
      }
    }

    Object.assign(patient, updatePatientDto);
    const updatedPatient = await this.patientRepository.save(patient);

    return plainToInstance(PatientDto, updatedPatient, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }
  }
}
