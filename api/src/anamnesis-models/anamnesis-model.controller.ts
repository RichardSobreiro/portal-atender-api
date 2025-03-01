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
import { AuthUser } from '../auth/auth-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('anamnesis-models')
export class AnamnesisModelController {
  constructor(private readonly anamnesisModelService: AnamnesisModelService) {}

  /**
   * Create a new Anamnesis Model
   */
  @Post()
  async create(
    @AuthUser() user,
    @Body() dto: CreateAnamnesisModelDto,
  ): Promise<AnamnesisModelDto> {
    return this.anamnesisModelService.create(dto, user.companyId);
  }

  /**
   * Retrieve all Anamnesis Models
   */
  @Get()
  async findAll(
    @AuthUser() user,
    @Query() query: QueryAnamnesisModelDto,
  ): Promise<AnamnesisModelDto[]> {
    return this.anamnesisModelService.findAll(query, user.companyId);
  }

  /**
   * Retrieve a single Anamnesis Model by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AnamnesisModelDto> {
    return this.anamnesisModelService.findOne(id);
  }

  /**
   * Update an Anamnesis Model
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnamnesisModelDto,
    @AuthUser() user,
  ): Promise<AnamnesisModelDto> {
    return this.anamnesisModelService.update(id, dto, user.companyId);
  }

  /**
   * Delete an Anamnesis Model
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @AuthUser() user): Promise<void> {
    return this.anamnesisModelService.remove(id, user.companyId);
  }
}
