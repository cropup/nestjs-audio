import { Module } from '@nestjs/common';
import { TranscriptsModule } from '../transcripts/transcripts.module';
import { AudiosModule } from '../audios/audios.module';
import { FilesModule } from '../files/files.module';
import { RelationalAnalysisPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AnalysesService } from './analyses.service';
import { AnalysesController } from './analyses.controller';
import { AiModule } from '../ai/ai.module';
@Module({
  imports: [
    TranscriptsModule,
    AudiosModule,
    FilesModule,
    AiModule,
    RelationalAnalysisPersistenceModule,
  ],
  controllers: [AnalysesController],
  providers: [AnalysesService],
  exports: [AnalysesService, RelationalAnalysisPersistenceModule],
})
export class AnalysesModule {}
