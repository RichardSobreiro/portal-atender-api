/** @format */

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
import { ProcedureService } from './procedure.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { ProcedureDto } from './dto/procedure.dto';
import { ProcedureQueryDto } from './dto/procedure-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('procedures')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  async create(
    @Body() createProcedureDto: CreateProcedureDto,
  ): Promise<ProcedureDto> {
    return this.procedureService.create(createProcedureDto);
  }

  @Get()
  async findAll(@Query() query: ProcedureQueryDto): Promise<any> {
    return this.procedureService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProcedureDto> {
    return this.procedureService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
  ): Promise<ProcedureDto> {
    return this.procedureService.update(id, updateProcedureDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.procedureService.remove(id);
  }
}
