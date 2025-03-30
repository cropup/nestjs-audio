import { AudiosModule } from '../audios/audios.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { TranscriptsService } from './transcripts.service';
import { TranscriptsController } from './transcripts.controller';
import { RelationalTranscriptPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    AudiosModule,
    FilesModule,
    AiModule,
    RelationalTranscriptPersistenceModule,
  ],
  controllers: [TranscriptsController],
  providers: [TranscriptsService],
  exports: [TranscriptsService, RelationalTranscriptPersistenceModule],
})
export class TranscriptsModule {}
