/** @format */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientImagesController } from './patient-images.controller';
import { PatientImageService } from './patient-image.service';
import { AwsS3Service } from '../aws/aws-s3.service';
import { PatientImage } from './entities/patient-image.entity';
import { PatientService } from '../patients/patient.service';
import { Patient } from '../patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientImage, Patient])],
  controllers: [PatientImagesController],
  providers: [PatientImageService, AwsS3Service, PatientService],
  exports: [PatientImageService],
})
export class PatientImagesModule {}
