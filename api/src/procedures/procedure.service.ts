/** @format */

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { name, companyId } = createProcedureDto;

    // Check if a procedure with the same name already exists (either default or in the same company)
    const duplicateProcedure = await this.procedureRepository.findOne({
      where: [
        { name, company: { id: companyId } },
        { name, company: null },
      ],
    });

    if (duplicateProcedure) {
      throw new ConflictException(
        `Um procedimento com o mesmo nome já existe. Vá para a edição do procedimento ${duplicateProcedure.name}.`,
      );
    }

    // Create and save the procedure
    const procedure = this.procedureRepository.create({
      ...createProcedureDto,
      company: companyId ? ({ id: companyId } as any) : null, // Manually link company if provided
    });
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

    if (query.searchTerm) {
      queryBuilder.andWhere(
        '(LOWER(procedure.name) LIKE LOWER(:searchTerm) OR LOWER(procedure.category) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${query.searchTerm}%` },
      );
    }

    queryBuilder.orderBy('procedure.name', 'ASC');

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
    const existingProcedure = await this.procedureRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!existingProcedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }

    const { name, companyId } = updateProcedureDto;

    // Check if a procedure with the same name already exists (either default or in the same company)
    const duplicateProcedure = await this.procedureRepository.findOne({
      where: [
        { name, company: { id: companyId } },
        { name, company: null },
      ],
    });

    if (duplicateProcedure && duplicateProcedure.id !== id) {
      throw new ConflictException(
        'Um procedimento com o mesmo nome já existe.',
      );
    }

    // If it's a default procedure (companyId = null), create a new custom procedure instead
    if (!existingProcedure.company) {
      const newProcedure = this.procedureRepository.create({
        ...updateProcedureDto,
        company: companyId ? { id: companyId } : null, // Assign the provided company ID
      });
      await this.procedureRepository.save(newProcedure);
      return newProcedure;
    }

    // If it's a company-specific procedure, update it normally
    Object.assign(existingProcedure, updateProcedureDto);
    await this.procedureRepository.save(existingProcedure);
    return existingProcedure;
  }

  async remove(id: string): Promise<void> {
    const procedure = await this.procedureRepository.findOne({ where: { id } });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }

    await this.procedureRepository.remove(procedure);
  }
}
