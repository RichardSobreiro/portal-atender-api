/** @format */
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsS3Service {
  private s3: S3;
  private bucketName: string;
  private environment: string;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: 'v4',
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
    this.environment = process.env.AWS_ENVIRONMENT!; // Example: 'Producao'
  }

  /**
   * Uploads a file to AWS S3 using a predefined structure.
   * The filename is the image ID from the database.
   */
  async uploadFile(
    file: Express.Multer.File,
    imageId: string,
    fileType: string,
  ): Promise<void> {
    const uploadParams: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: `${this.environment}/${imageId}.${fileType}`, // Use environment prefix
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private', // ✅ Ensures the file is not publicly accessible
    };

    await this.s3.upload(uploadParams).promise();
  }

  /**
   * Generates a signed URL to allow temporary access to a private image.
   * @param imageId - The ID of the image in the database
   * @param fileType - The file extension (e.g., 'jpg', 'png')
   * @returns A time-limited signed URL for accessing the image
   */
  async getSignedUrl(imageId: string, fileType: string): Promise<string> {
    const fileKey = `${this.environment}/${imageId}.${fileType}`;

    const signedUrl = this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: fileKey,
      Expires: 900, // ⏳ URL expires in 900 seconds (15 minutes)
    });

    return signedUrl;
  }

  /**
   * Deletes a file from AWS S3.
   */
  async deleteFile(imageId: string, fileType: string): Promise<void> {
    const fileKey = `${this.environment}/${imageId}.${fileType}`;

    const deleteParams: S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    await this.s3.deleteObject(deleteParams).promise();
  }
}
