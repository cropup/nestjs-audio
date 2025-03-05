import { Module } from '@nestjs/common';
import { AudioRepository } from '../audio.repository';
import { AudioRelationalRepository } from './repositories/audio.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioEntity } from './entities/audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioEntity])],
  providers: [
    {
      provide: AudioRepository,
      useClass: AudioRelationalRepository,
    },
  ],
  exports: [AudioRepository],
})
export class RelationalAudioPersistenceModule {}
