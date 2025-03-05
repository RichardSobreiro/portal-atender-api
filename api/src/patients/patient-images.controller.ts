/** @format */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Delete,
  Param,
  Body,
  Get,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { PatientImageService } from './patient-image.service';
import { PatientImageDto } from './dtos/patient-image.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Controller('patients/:patientId/images')
@UseGuards(JwtAuthGuard)
export class PatientImagesController {
  constructor(private readonly patientImageService: PatientImageService) {}

  /**
   * Upload images for a specific patient.
   */
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per image
    }),
  )
  async uploadImages(
    @Param('patientId') patientId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    body: { imagesMetadata: string },
    @AuthUser() user,
  ): Promise<PatientImageDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhuma imagem foi enviada.');
    }

    let imagesMetadata: { id: string | null; originalName: string }[];

    try {
      imagesMetadata = JSON.parse(body.imagesMetadata); // ✅ Parse string to object array
    } catch (error: any) {
      throw new BadRequestException(
        'Formato inválido para imagesMetadata.',
        error,
      );
    }

    return this.patientImageService.uploadImages(
      files,
      imagesMetadata,
      patientId,
      user.companyId,
    );
  }

  /**
   * Retrieve all images for a specific patient.
   */
  @Get()
  async getPatientImages(
    @Param('patientId') patientId: string,
  ): Promise<PatientImageDto[]> {
    return this.patientImageService.getPatientImages(patientId);
  }

  /**
   * Delete a specific image for a specific patient.
   */
  @Delete(':imageId')
  async deleteImage(
    @Param('patientId') patientId: string,
    @Param('imageId') imageId: string,
  ): Promise<{ message: string }> {
    await this.patientImageService.deleteImage(patientId, imageId);
    return { message: 'Imagem deletada com sucesso' };
  }
}
