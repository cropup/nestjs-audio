import { Module } from '@nestjs/common';
import { TranscriptRepository } from '../transcript.repository';
import { TranscriptRelationalRepository } from './repositories/transcript.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptEntity } from './entities/transcript.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranscriptEntity])],
  providers: [
    {
      provide: TranscriptRepository,
      useClass: TranscriptRelationalRepository,
    },
  ],
  exports: [TranscriptRepository],
})
export class RelationalTranscriptPersistenceModule {}
