import {
  // common
  Module,
} from '@nestjs/common';
import { AudiosService } from './audios.service';
import { AudiosController } from './audios.controller';
import { RelationalAudioPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    FilesModule,
    // import modules, etc.
    RelationalAudioPersistenceModule,
  ],
  controllers: [AudiosController],
  providers: [AudiosService],
  exports: [AudiosService, RelationalAudioPersistenceModule],
})
export class AudiosModule {}
