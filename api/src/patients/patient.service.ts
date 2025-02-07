/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { PatientQueryDto } from './dtos/patient-query.dto';
import { PatientDto } from './dtos/patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const newPatient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(newPatient);
  }

  async findAll(query: PatientQueryDto) {
    const {
      page = 1,
      limit = 10,
      nome,
      cpfCnpj,
      telefone,
      email,
      cidade,
      estado,
    } = query;

    const skip = (page - 1) * limit; // Pagination offset

    const queryBuilder: SelectQueryBuilder<Patient> =
      this.patientRepository.createQueryBuilder('patient');

    queryBuilder.leftJoinAndSelect('patient.telefones', 'telefones');
    queryBuilder.leftJoinAndSelect('patient.emails', 'emails');
    queryBuilder.leftJoinAndSelect('patient.enderecos', 'enderecos');

    if (nome) {
      queryBuilder.andWhere('LOWER(patient.nome) LIKE LOWER(:nome)', {
        nome: `%${nome}%`,
      });
    }

    if (cpfCnpj) {
      queryBuilder.andWhere('patient.cpfCnpj = :cpfCnpj', { cpfCnpj });
    }

    if (telefone) {
      queryBuilder.andWhere('telefones.numero LIKE :telefone', {
        telefone: `%${telefone}%`,
      });
    }

    if (email) {
      queryBuilder.andWhere('emails.endereco LIKE :email', {
        email: `%${email}%`,
      });
    }

    if (cidade) {
      queryBuilder.andWhere('enderecos.cidade LIKE :cidade', {
        cidade: `%${cidade}%`,
      });
    }

    if (estado) {
      queryBuilder.andWhere('enderecos.estado = :estado', { estado });
    }

    queryBuilder.skip(skip).take(limit);

    const [patients, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: patients,
    };
  }

  async findOne(id: string): Promise<PatientDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['telefones', 'emails', 'enderecos', 'responsaveis'],
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    return new PatientDto(patient);
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['telefones', 'emails', 'enderecos', 'responsaveis'],
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }

    // Update primitive fields (excluding relations)
    Object.assign(patient, updatePatientDto);

    // Update related entities
    if (updatePatientDto.telefones) {
      patient.telefones = updatePatientDto.telefones.map((phoneDto) => ({
        ...patient.telefones.find((p) => p.id === phoneDto.id),
        ...phoneDto,
      }));
    }

    if (updatePatientDto.emails) {
      patient.emails = updatePatientDto.emails.map((emailDto) => ({
        ...patient.emails.find((e) => e.id === emailDto.id),
        ...emailDto,
      }));
    }

    if (updatePatientDto.enderecos) {
      patient.enderecos = updatePatientDto.enderecos.map((addressDto) => ({
        ...patient.enderecos.find((a) => a.id === addressDto.id),
        ...addressDto,
      }));
    }

    if (updatePatientDto.responsaveis) {
      patient.responsaveis = updatePatientDto.responsaveis.map(
        (responsibleDto) => ({
          ...patient.responsaveis.find((r) => r.id === responsibleDto.id),
          ...responsibleDto,
        }),
      );
    }

    await this.patientRepository.save(patient);

    return new PatientDto(patient);
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }
  }
}
