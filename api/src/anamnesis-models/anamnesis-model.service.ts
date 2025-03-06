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

  async findAllBasicInfo(
    companyId: string,
  ): Promise<
    { id: string; name: string; type: string; companyId: string | null }[]
  > {
    const whereCondition: any[] = [
      { company: { id: companyId } },
      { company: IsNull() },
    ];

    const models = await this.anamnesisModelRepository.find({
      where: whereCondition,
      select: ['id', 'name', 'type'],
      relations: ['company'],
      order: { name: 'ASC' },
    });

    const modelsDto = models.map((model) => ({
      id: model.id,
      name: model.name,
      type: model.type,
      companyId: model.company ? model.company.id : null, // ✅ Extracting `companyId` safely
    }));

    return modelsDto;
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
      const newDto: CreateAnamnesisModelDto = {
        name: dto.name,
        type: dto.type,
        companyId,
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
      const existingGroups = await this.questionGroupRepository.find({
        where: { anamnesisModel: { id: anamnesisModel.id } },
        relations: ['questions', 'questions.options'],
      });

      let updatedGroups: QuestionGroup[] = [];

      for (const groupDto of dto.groups) {
        let group = await this.questionGroupRepository.findOne({
          where: { id: groupDto.id },
          relations: ['questions'],
        });

        if (!group) {
          group = this.questionGroupRepository.create({
            name: groupDto.name,
            anamnesisModel: anamnesisModel,
          });

          group = await this.questionGroupRepository.save(group);
        }

        if (groupDto.name) {
          group.name = groupDto.name;
        }

        let updatedQuestions: Question[] = [];
        const existingQuestions = await this.questionRepository.find({
          where: { group: { id: group.id } },
        });
        if (groupDto.questions) {
          for (const questionDto of groupDto.questions) {
            let question = await this.questionRepository.findOne({
              where: { id: questionDto.id },
              relations: ['options'],
            });

            if (!question) {
              question = this.questionRepository.create({
                type: questionDto.type,
                text: questionDto.text,
                required: questionDto.required,
                order: questionDto.order,
                group: group,
              });

              question = await this.questionRepository.save(question);
            }

            if (questionDto.type) question.type = questionDto.type;
            if (questionDto.text) question.text = questionDto.text;
            if (questionDto.required !== undefined)
              question.required = questionDto.required;
            if (questionDto.order !== undefined)
              question.order = questionDto.order;

            let updatedOptions: Option[] = [];
            if (questionDto.options) {
              for (const optionDto of questionDto.options) {
                let option = await this.optionRepository.findOne({
                  where: { id: optionDto.id },
                });

                if (!option) {
                  option = this.optionRepository.create({
                    text: optionDto.text,
                    question: question,
                  });

                  option = await this.optionRepository.save(option);
                }

                if (optionDto.text) option.text = optionDto.text;
                option = await this.optionRepository.save(option);
                updatedOptions.push(option);
              }
            }

            question.options = updatedOptions;
            question = await this.questionRepository.save(question);
            updatedQuestions.push(question);
          }
        }

        const deletedQuestions = existingQuestions.filter(
          (existingQuestion) =>
            !updatedQuestions.some((q) => q.id === existingQuestion.id),
        );

        if (deletedQuestions.length > 0) {
          await this.questionRepository.remove(deletedQuestions);
        }

        group.questions = updatedQuestions;
        group = await this.questionGroupRepository.save(group);
        updatedGroups.push(group);
      }

      const deletedGroups = existingGroups.filter(
        (existingGroup) =>
          !updatedGroups.some((g) => g.id === existingGroup.id),
      );

      if (deletedGroups.length > 0) {
        await this.questionGroupRepository.remove(deletedGroups);
      }

      anamnesisModel.groups = updatedGroups;
    }

    // anamnesisModel.groups = await this.questionGroupRepository.find({
    //   where: { anamnesisModel: { id: anamnesisModel.id } },
    //   relations: ['questions', 'questions.options'],
    // });

    const updatedModel =
      await this.anamnesisModelRepository.save(anamnesisModel);
    return this.mapToDto(updatedModel);
  }

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
