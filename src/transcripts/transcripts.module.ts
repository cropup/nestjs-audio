import { AudiosModule } from '../audios/audios.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { TranscriptsService } from './transcripts.service';
import { TranscriptsController } from './transcripts.controller';
import { RelationalTranscriptPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    AudiosModule,

    // import modules, etc.
    RelationalTranscriptPersistenceModule,
  ],
  controllers: [TranscriptsController],
  providers: [TranscriptsService],
  exports: [TranscriptsService, RelationalTranscriptPersistenceModule],
})
export class TranscriptsModule {}
