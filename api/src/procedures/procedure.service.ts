/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';
import { Procedure } from './entities/procedure.entity';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { ProcedureDto } from './dto/procedure.dto';
import { ProcedureQueryDto } from './dto/procedure-query.dto';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectRepository(Procedure)
    private readonly procedureRepository: Repository<Procedure>,
  ) {}

  async create(createProcedureDto: CreateProcedureDto): Promise<ProcedureDto> {
    const procedure = this.procedureRepository.create(createProcedureDto);
    await this.procedureRepository.save(procedure);
    return procedure;
  }

  async findAll(query: ProcedureQueryDto): Promise<any> {
    const { page = 1, limit = 10, companyId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder: SelectQueryBuilder<Procedure> = this.procedureRepository
      .createQueryBuilder('procedure')
      .where('procedure.companyId IS NULL') // Default procedures
      .orWhere('procedure.companyId = :companyId', { companyId });

    queryBuilder.skip(skip).take(limit);

    const [procedures, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: procedures,
    };
  }

  async findOne(id: string): Promise<ProcedureDto> {
    const procedure = await this.procedureRepository.findOne({ where: { id } });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }

    return procedure;
  }

  async update(
    id: string,
    updateProcedureDto: UpdateProcedureDto,
  ): Promise<ProcedureDto> {
    const procedure = await this.findOne(id);
    const updatedProcedure = Object.assign(procedure, updateProcedureDto);
    await this.procedureRepository.save(updatedProcedure);
    return updatedProcedure;
  }

  async remove(id: string): Promise<void> {
    const procedure = await this.procedureRepository.findOne({ where: { id } });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }

    await this.procedureRepository.remove(procedure);
  }
}
