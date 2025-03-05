import {
  // common
  Module,
} from '@nestjs/common';
import { AudiosService } from './audios.service';
import { AudiosController } from './audios.controller';
import { RelationalAudioPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalAudioPersistenceModule,
  ],
  controllers: [AudiosController],
  providers: [AudiosService],
  exports: [AudiosService, RelationalAudioPersistenceModule],
})
export class AudiosModule {}
