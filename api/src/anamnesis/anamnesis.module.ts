import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnamnesisService } from './anamnesis.service';
import { AnamnesisController } from './anamnesis.controller';
import { Anamnesis } from './entities/anamnesis.entity';
import { AnamnesisQuestionGroup } from './entities/anamnesis-question-group.entity';
import { AnamnesisQuestion } from './entities/anamnesis-question.entity';
import { AnamnesisOption } from './entities/anamnesis-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Anamnesis,
      AnamnesisQuestionGroup,
      AnamnesisQuestion,
      AnamnesisOption,
    ]),
  ],
  controllers: [AnamnesisController],
  providers: [AnamnesisService],
  exports: [AnamnesisService],
})
export class AnamnesisModule {}
