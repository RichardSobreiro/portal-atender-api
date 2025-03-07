import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AnamnesisService } from './anamnesis.service';
import { CreateAnamnesisDto } from './dtos/create-anamnesis.dto';
import { UpdateAnamnesisDto } from './dtos/update-anamnesis.dto';
import { AnamnesisQueryDto } from './dtos/anamnesis-query.dto';
import { AnamnesisDto } from './dtos/anamnesis.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('anamnesis')
@UseGuards(JwtAuthGuard)
export class AnamnesisController {
  constructor(private readonly anamnesisService: AnamnesisService) {}

  @Post()
  async create(
    @Body() createAnamnesisDto: CreateAnamnesisDto,
  ): Promise<AnamnesisDto> {
    return await this.anamnesisService.create(createAnamnesisDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnamnesisDto: UpdateAnamnesisDto,
  ): Promise<AnamnesisDto> {
    return await this.anamnesisService.update(id, updateAnamnesisDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AnamnesisDto> {
    return await this.anamnesisService.findOne(id);
  }

  @Get('patient/:patientId')
  async findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<AnamnesisDto[]> {
    return await this.anamnesisService.findByPatient(patientId);
  }

  @Get()
  async findAll(@Query() query: AnamnesisQueryDto): Promise<any> {
    return await this.anamnesisService.findAll(query);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.anamnesisService.delete(id);
  }
}
