import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnamnesisModel } from './entities/anamnesis-model.entity';
import { CreateAnamnesisModelDto } from './dtos/create-anamnesis-model.dto';
import { UpdateAnamnesisModelDto } from './dtos/update-anamnesis-model.dto';
import { QueryAnamnesisModelDto } from './dtos/query-anamnesis-model.dto';
import { QuestionGroup } from './entities/question-group.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { AnamnesisModelDto } from './dtos/anamnesis-model.dto';

@Injectable()
export class AnamnesisModelService {
  constructor(
    @InjectRepository(AnamnesisModel)
    private anamnesisModelRepository: Repository<AnamnesisModel>,

    @InjectRepository(QuestionGroup)
    private questionGroupRepository: Repository<QuestionGroup>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  /**
   * Create a new Anamnesis Model
   */
  async create(dto: CreateAnamnesisModelDto): Promise<AnamnesisModelDto> {
    const anamnesisModel = this.anamnesisModelRepository.create({
      ...dto,
      company: dto.companyId ? { id: dto.companyId } : null, // ✅ Handle companyId
      groups: dto.groups.map((group) =>
        this.questionGroupRepository.create({
          ...group,
          questions: group.questions.map((question) =>
            this.questionRepository.create({
              ...question,
              options: question.options?.map((option) =>
                this.optionRepository.create(option),
              ),
            }),
          ),
        }),
      ),
    });

    const savedModel = await this.anamnesisModelRepository.save(anamnesisModel);
    return this.mapToDto(savedModel);
  }

  /**
   * Retrieve all Anamnesis Models with optional filters
   */
  async findAll(query: QueryAnamnesisModelDto): Promise<AnamnesisModelDto[]> {
    const whereCondition: any = [
      { company: { id: query.companyId } }, // ✅ Fetch custom models for the company
      { company: null }, // ✅ Fetch default (global) models
    ];

    if (query.name) {
      whereCondition.forEach((condition) => (condition.name = query.name));
    }

    if (query.type) {
      whereCondition.forEach((condition) => (condition.type = query.type));
    }

    const models = await this.anamnesisModelRepository.find({
      where: whereCondition,
      relations: ['groups', 'groups.questions', 'groups.questions.options'],
    });

    return models.map(this.mapToDto);
  }

  /**
   * Retrieve a single Anamnesis Model by ID
   */
  async findOne(id: string, companyId?: string): Promise<AnamnesisModelDto> {
    const whereCondition: any = { id };

    if (companyId) {
      whereCondition.company = { id: companyId }; // ✅ Ensure company ownership
    }

    const anamnesisModel = await this.anamnesisModelRepository.findOne({
      where: whereCondition,
      relations: ['groups', 'groups.questions', 'groups.questions.options'],
    });

    if (!anamnesisModel) {
      throw new NotFoundException(`Anamnesis Model with ID ${id} not found`);
    }

    return this.mapToDto(anamnesisModel);
  }

  /**
   * Update an existing Anamnesis Model by ID
   */
  async update(
    id: string,
    dto: UpdateAnamnesisModelDto,
  ): Promise<AnamnesisModelDto> {
    const anamnesisModel = await this.findOne(id);

    if (dto.name) anamnesisModel.name = dto.name;
    if (dto.type) anamnesisModel.type = dto.type;

    if (dto.groups) {
      for (const groupDto of dto.groups) {
        const group = await this.questionGroupRepository.findOne({
          where: { id: groupDto.id },
          relations: ['questions'],
        });

        if (!group) {
          throw new NotFoundException(
            `Question Group with ID ${groupDto.id} not found`,
          );
        }

        if (groupDto.name) group.name = groupDto.name;

        if (groupDto.questions) {
          for (const questionDto of groupDto.questions) {
            const question = await this.questionRepository.findOne({
              where: { id: questionDto.id },
              relations: ['options'],
            });

            if (!question) {
              throw new NotFoundException(
                `Question with ID ${questionDto.id} not found`,
              );
            }

            if (questionDto.type) question.type = questionDto.type;
            if (questionDto.text) question.text = questionDto.text;
            if (questionDto.required !== undefined)
              question.required = questionDto.required;
            if (questionDto.order !== undefined)
              question.order = questionDto.order;

            if (questionDto.options) {
              for (const optionDto of questionDto.options) {
                const option = await this.optionRepository.findOne({
                  where: { id: optionDto.id },
                });

                if (!option) {
                  throw new NotFoundException(
                    `Option with ID ${optionDto.id} not found`,
                  );
                }

                if (optionDto.text) option.text = optionDto.text;

                await this.optionRepository.save(option);
              }
            }

            await this.questionRepository.save(question);
          }
        }

        const updatedModel =
          await this.anamnesisModelRepository.save(anamnesisModel);
        return this.mapToDto(updatedModel);
      }
    }

    return await this.anamnesisModelRepository.save(anamnesisModel);
  }

  /**
   * Delete an Anamnesis Model by ID
   */
  async remove(id: string): Promise<void> {
    const anamnesisModel = await this.anamnesisModelRepository.findOne({
      where: { id },
    });

    if (!anamnesisModel) {
      throw new NotFoundException(`Anamnese não encontrada`);
    }

    await this.anamnesisModelRepository.remove(anamnesisModel);
  }

  private mapToDto(anamnesisModel: AnamnesisModel): AnamnesisModelDto {
    return {
      id: anamnesisModel.id,
      name: anamnesisModel.name,
      type: anamnesisModel.type,
      companyId: anamnesisModel.company?.id || null,
      groups: anamnesisModel.groups.map((group) => ({
        id: group.id,
        name: group.name,
        questions: group.questions.map((question) => ({
          id: question.id,
          type: question.type,
          text: question.text,
          required: question.required,
          order: question.order,
          options:
            question.options?.map((option) => ({
              id: option.id,
              text: option.text,
            })) || [],
        })),
      })),
    };
  }
}
