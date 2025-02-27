import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnamnesisModelService } from './anamnesis-model.service';
import { AnamnesisModelController } from './anamnesis-model.controller';
import { AnamnesisModel } from './entities/anamnesis-model.entity';
import { QuestionGroup } from './entities/question-group.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnamnesisModel, QuestionGroup, Question, Option]),
  ],
  controllers: [AnamnesisModelController],
  providers: [AnamnesisModelService],
  exports: [AnamnesisModelService],
})
export class AnamnesisModelModule {}
