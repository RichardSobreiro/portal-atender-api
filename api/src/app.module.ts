import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patients/patient.module';
import { PatientRecordModule } from './patients/patient-record.module';
import { PatientImagesModule } from './patients/patient-images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    PatientModule,
    PatientRecordModule,
    PatientImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
