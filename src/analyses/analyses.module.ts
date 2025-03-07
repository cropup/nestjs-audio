import { TranscriptsModule } from '../transcripts/transcripts.module';
import { AudiosModule } from '../audios/audios.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { AnalysesController } from './analyses.controller';
import { RelationalAnalysisPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TranscriptsModule,

    AudiosModule,

    // import modules, etc.
    RelationalAnalysisPersistenceModule,
  ],
  controllers: [AnalysesController],
  providers: [AnalysesService],
  exports: [AnalysesService, RelationalAnalysisPersistenceModule],
})
export class AnalysesModule {}
