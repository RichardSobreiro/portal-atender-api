import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Anamnesis } from './entities/anamnesis.entity';
import { CreateAnamnesisDto } from './dtos/create-anamnesis.dto';
import { UpdateAnamnesisDto } from './dtos/update-anamnesis.dto';
import { AnamnesisDto } from './dtos/anamnesis.dto';
import { plainToInstance } from 'class-transformer';
import { AnamnesisQueryDto } from './dtos/anamnesis-query.dto';

@Injectable()
export class AnamnesisService {
  constructor(
    @InjectRepository(Anamnesis)
    private readonly anamnesisRepository: Repository<Anamnesis>,
  ) {}

  async create(createAnamnesisDto: CreateAnamnesisDto): Promise<AnamnesisDto> {
    const newAnamnesis = this.anamnesisRepository.create(createAnamnesisDto);
    const savedAnamnesis = await this.anamnesisRepository.save(newAnamnesis);

    return plainToInstance(AnamnesisDto, savedAnamnesis);
  }

  async update(
    id: string,
    updateAnamnesisDto: UpdateAnamnesisDto,
  ): Promise<AnamnesisDto> {
    const anamnesis = await this.anamnesisRepository.findOne({
      where: { id },
      relations: ['groups', 'groups.questions'],
    });

    if (!anamnesis) {
      throw new NotFoundException(`Anamnese com ID ${id} não encontrada.`);
    }

    anamnesis.groups.forEach((group, groupIndex) => {
      group.questions.forEach((question, questionIndex) => {
        const updatedQuestion =
          updateAnamnesisDto.groups[groupIndex]?.questions[questionIndex];
        if (updatedQuestion) {
          question.answerText =
            updatedQuestion.answerText ?? question.answerText;
          question.selectedOptionIds =
            updatedQuestion.selectedOptionIds ?? question.selectedOptionIds;
        }
      });
    });

    const updatedAnamnesis = await this.anamnesisRepository.save(anamnesis);
    return plainToInstance(AnamnesisDto, updatedAnamnesis);
  }

  async findOne(id: string): Promise<AnamnesisDto> {
    const anamnesis = await this.anamnesisRepository.findOne({
      where: { id },
      relations: ['groups', 'groups.questions', 'groups.questions.options'],
    });

    if (!anamnesis) {
      throw new NotFoundException(`Anamnese com ID ${id} não encontrada.`);
    }

    return plainToInstance(AnamnesisDto, anamnesis);
  }

  async findByPatient(patientId: string): Promise<AnamnesisDto[]> {
    const anamneses = await this.anamnesisRepository.find({
      where: { patient: { id: patientId } },
      relations: ['groups', 'groups.questions', 'groups.questions.options'],
    });

    return anamneses.map((anamnesis) =>
      plainToInstance(AnamnesisDto, anamnesis),
    );
  }

  async findAll(query: AnamnesisQueryDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      professionalId,
      anamnesisModelType,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder: SelectQueryBuilder<Anamnesis> = this.anamnesisRepository
      .createQueryBuilder('anamnesis')
      .leftJoinAndSelect('anamnesis.professional', 'professional')
      .leftJoinAndSelect('anamnesis.anamnesisModel', 'anamnesisModel')
      .leftJoinAndSelect('anamnesis.groups', 'groups')
      .leftJoinAndSelect('groups.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options');

    if (query.patientId) {
      queryBuilder.andWhere('anamnesis.patientId = :patientId', {
        patientId: query.patientId,
      });
    }

    if (startDate) {
      queryBuilder.andWhere('anamnesis.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('anamnesis.createdAt <= :endDate', { endDate });
    }

    if (professionalId) {
      queryBuilder.andWhere('anamnesis.professionalId = :professionalId', {
        professionalId,
      });
    }

    if (anamnesisModelType) {
      queryBuilder.andWhere('anamnesisModel.type = :anamnesisModelType', {
        anamnesisModelType,
      });
    }

    queryBuilder.orderBy('anamnesis.createdAt', 'DESC');

    queryBuilder.skip(skip).take(limit);

    const [anamneses, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: anamneses.map((anamnesis) =>
        plainToInstance(AnamnesisDto, anamnesis),
      ),
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.anamnesisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Anamnese com ID ${id} não encontrada.`);
    }
  }
}
