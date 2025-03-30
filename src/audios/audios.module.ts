import { Module } from '@nestjs/common';
import { AudiosService } from './audios.service';
import { AudiosController } from './audios.controller';
import { RelationalAudioPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { createAudioMulterConfig } from '../config/multer.config';

@Module({
  imports: [
    FilesModule,
    RelationalAudioPersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return createAudioMulterConfig(configService);
      },
    }),
  ],
  controllers: [AudiosController],
  providers: [AudiosService],
  exports: [AudiosService, RelationalAudioPersistenceModule],
})
export class AudiosModule {}
