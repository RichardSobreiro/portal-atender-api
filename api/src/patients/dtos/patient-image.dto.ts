/** @format */
import { Expose } from 'class-transformer';

export class PatientImageDto {
  @Expose()
  id: string;

  @Expose()
  originalName: string; // Original file name

  @Expose()
  imageUrl: string; // Dynamically generated image URL

  @Expose()
  createdAt: Date;
}
