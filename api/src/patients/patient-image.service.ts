/** @format */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientImage } from './entities/patient-image.entity';
import { PatientService } from '../patients/patient.service';
import { AwsS3Service } from '../aws/aws-s3.service';
import { plainToInstance } from 'class-transformer';
import { PatientImageDto } from './dtos/patient-image.dto';

@Injectable()
export class PatientImageService {
  constructor(
    @InjectRepository(PatientImage)
    private readonly patientImageRepository: Repository<PatientImage>,
    private readonly patientService: PatientService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  /** @format */
  async uploadImages(
    files: Express.Multer.File[],
    imagesMetadata: { id: string | null; originalName: string }[],
    patientId: string,
  ): Promise<PatientImageDto[]> {
    // Validate if the patient exists
    const patient = await this.patientService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const uploadedImages: PatientImage[] = [];
    let fileIndex = 0; // Separate index for new files

    for (let i = 0; i < imagesMetadata.length; i++) {
      const { id, originalName } = imagesMetadata[i];

      if (id) {
        // Validate that the image exists in the database
        const existingImage = await this.patientImageRepository.findOne({
          where: { id, patient: { id: patientId } },
        });

        if (!existingImage) {
          throw new NotFoundException(`Imagem com ID ${id} não encontrada.`);
        }

        // If the image exists, add it to the response
        uploadedImages.push(existingImage);
      } else {
        // New image → Save metadata first to get ID
        const file = files[fileIndex];

        if (!file) {
          throw new BadRequestException(
            `Arquivo ausente para a imagem ${originalName}`,
          );
        }

        // Extract file extension (without the dot)
        const fileType = file.mimetype.split('/')[1];

        const newImage = this.patientImageRepository.create({
          patient,
          originalName: originalName || file.originalname, // Ensure it's not null
          fileType,
        });

        const savedImage = await this.patientImageRepository.save(newImage);

        // Upload to S3 using the database ID as filename
        await this.awsS3Service.uploadFile(file, savedImage.id, fileType);

        uploadedImages.push(savedImage);
        fileIndex++;
      }
    }

    const imageDtos = await Promise.all(
      uploadedImages.map(async (image) => {
        const signedUrl = await this.awsS3Service.getSignedUrl(
          image.id,
          image.fileType,
        );

        return plainToInstance(PatientImageDto, {
          id: image.id,
          originalName: image.originalName,
          imageUrl: signedUrl,
          createdAt: image.createdAt,
        });
      }),
    );

    return imageDtos;
  }

  async getPatientImages(patientId: string): Promise<PatientImageDto[]> {
    const images = await this.patientImageRepository.find({
      where: { patient: { id: patientId }, isDeleted: false },
      order: { createdAt: 'DESC' },
    });

    // Generate signed URLs dynamically
    const imageDtos = await Promise.all(
      images.map(async (image) => {
        const signedUrl = await this.awsS3Service.getSignedUrl(
          image.id,
          image.fileType,
        );
        return plainToInstance(PatientImageDto, {
          ...image,
          imageUrl: signedUrl,
        });
      }),
    );

    return imageDtos;
  }

  async deleteImage(patientId: string, imageId: string): Promise<void> {
    // Validate if the image exists and belongs to the specified patient
    const image = await this.patientImageRepository.findOne({
      where: { id: imageId, patient: { id: patientId } },
    });

    if (!image) {
      throw new NotFoundException(`Imagem com ID ${imageId} não encontrada.`);
    }

    if (image.isDeleted) {
      throw new BadRequestException(
        `Imagem com ID ${imageId} já foi deletada.`,
      );
    }

    // Delete from AWS S3
    await this.awsS3Service.deleteFile(image.id, image.fileType);

    // Mark image as deleted in the database
    image.isDeleted = true;
    image.deletedAt = new Date();
    await this.patientImageRepository.save(image);
  }
}
