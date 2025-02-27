import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnamnesisModelService } from './anamnesis-model.service';
import { CreateAnamnesisModelDto } from './dtos/create-anamnesis-model.dto';
import { UpdateAnamnesisModelDto } from './dtos/update-anamnesis-model.dto';
import { QueryAnamnesisModelDto } from './dtos/query-anamnesis-model.dto';
import { AnamnesisModelDto } from './dtos/anamnesis-model.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('anamnesis-models')
export class AnamnesisModelController {
  constructor(private readonly anamnesisModelService: AnamnesisModelService) {}

  /**
   * Create a new Anamnesis Model
   */
  @Post()
  async create(
    @Body() dto: CreateAnamnesisModelDto,
  ): Promise<AnamnesisModelDto> {
    return this.anamnesisModelService.create(dto);
  }

  /**
   * Retrieve all Anamnesis Models
   */
  @Get()
  async findAll(
    @Query() query: QueryAnamnesisModelDto,
  ): Promise<AnamnesisModelDto[]> {
    return this.anamnesisModelService.findAll(query);
  }

  /**
   * Retrieve a single Anamnesis Model by ID
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('companyId') companyId?: string,
  ): Promise<AnamnesisModelDto> {
    return this.anamnesisModelService.findOne(id, companyId);
  }

  /**
   * Update an Anamnesis Model
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnamnesisModelDto,
  ): Promise<AnamnesisModelDto> {
    return this.anamnesisModelService.update(id, dto);
  }

  /**
   * Delete an Anamnesis Model
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.anamnesisModelService.remove(id);
  }
}
