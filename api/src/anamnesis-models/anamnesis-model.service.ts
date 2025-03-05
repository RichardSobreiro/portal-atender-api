import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Repository } from 'typeorm';
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
  async create(
    dto: CreateAnamnesisModelDto,
    companyId: string,
  ): Promise<AnamnesisModelDto> {
    const existingModel = await this.anamnesisModelRepository.findOne({
      where: { name: dto.name, type: dto.type, company: { id: companyId } },
      relations: ['company'],
    });

    if (existingModel && existingModel?.company?.id === companyId) {
      throw new ConflictException(
        `Já existe um modelo de anamnese com o nome "${dto.name}" e tipo "${dto.type}".`,
      );
    }

    const anamnesisModel = this.anamnesisModelRepository.create({
      ...dto,
      company: { id: companyId },
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
  async findAll(
    query: QueryAnamnesisModelDto,
    companyId: string,
  ): Promise<AnamnesisModelDto[]> {
    let whereCondition: any[] = [];

    // ✅ Ensure both company-specific and global models are searched
    whereCondition.push(
      { company: { id: companyId } }, // ✅ Custom models for the company
      { company: IsNull() }, // ✅ Default models (global)
    );

    // ✅ Apply searchTerm correctly to `name` OR `type`
    if (query.searchTerm) {
      const searchFilter = ILike(`%${query.searchTerm}%`);
      whereCondition = whereCondition.flatMap((condition) => [
        { ...condition, name: searchFilter },
        { ...condition, type: searchFilter },
      ]);
    }

    const models = await this.anamnesisModelRepository.find({
      where: whereCondition,
      order: { name: 'ASC' },
      relations: [
        'groups',
        'groups.questions',
        'groups.questions.options',
        'company',
      ],
    });

    return models.map(this.mapToDto);
  }

  /**
   * Retrieve a single Anamnesis Model by ID
   */
  async findOne(id: string): Promise<AnamnesisModelDto> {
    const whereCondition: any = { id };

    const anamnesisModel = await this.anamnesisModelRepository.findOne({
      where: whereCondition,
      relations: [
        'groups',
        'groups.questions',
        'groups.questions.options',
        'company',
      ],
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
    companyId: string,
  ): Promise<AnamnesisModelDto> {
    const anamnesisModel = await this.findOne(id);

    // If the model is a default model (companyId = null), create a new one instead of updating
    if (!anamnesisModel.companyId) {
      // ✅ Manually map `UpdateAnamnesisModelDto` to `CreateAnamnesisModelDto`
      const newDto: CreateAnamnesisModelDto = {
        name: dto.name,
        type: dto.type,
        companyId, // ✅ Assign the user's companyId
        groups:
          dto.groups?.map((group) => ({
            name: group.name,
            questions:
              group.questions?.map((question) => ({
                type: question.type,
                text: question.text,
                required: question.required,
                order: question.order,
                options:
                  question.options?.map((option) => ({
                    text: option.text,
                  })) || [],
              })) || [],
          })) || [],
      };

      return this.create(newDto, companyId);
    }

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

        if (groupDto.name) {
          group.name = groupDto.name;
        }

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

            // ✅ Updating question properties
            if (questionDto.type) question.type = questionDto.type;
            if (questionDto.text) question.text = questionDto.text;
            if (questionDto.required !== undefined)
              question.required = questionDto.required;
            if (questionDto.order !== undefined)
              question.order = questionDto.order;

            // ✅ Handling question options
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

            // ✅ Save updated question before saving the group
            await this.questionRepository.save(question);
          }
        }

        // ✅ Ensure updated questions are attached to the group
        group.questions = await this.questionRepository.find({
          where: { id: In(groupDto.questions.map((q) => q.id)) },
          relations: ['options'],
        });

        // ✅ Save updated group after questions are saved
        await this.questionGroupRepository.save(group);
      }
    }

    // ✅ Ensure updated groups are attached to the anamnesis model
    anamnesisModel.groups = await this.questionGroupRepository.find({
      where: { id: In(dto.groups.map((g) => g.id)) },
      relations: ['questions', 'questions.options'],
    });

    // ✅ Save the final model with updated groups and questions
    const updatedModel =
      await this.anamnesisModelRepository.save(anamnesisModel);
    return this.mapToDto(updatedModel);
  }

  /**
   * Delete an Anamnesis Model by ID
   */
  async remove(id: string, companyId: string): Promise<void> {
    const anamnesisModel = await this.anamnesisModelRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!anamnesisModel) {
      throw new NotFoundException(`Anamnese não encontrada`);
    }

    if (!anamnesisModel.company) {
      throw new BadRequestException(
        `Modelos de anamnese padrão não podem ser deletados`,
      );
    }

    if (anamnesisModel.company.id != companyId) {
      throw new BadRequestException(
        `Você não tem permissão de deletar modelos de anamnese da empresa ${anamnesisModel.company.name}.`,
      );
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
