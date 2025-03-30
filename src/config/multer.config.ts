import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AllConfigType } from './config.type';

export const createAudioMulterConfig = (
  configService: ConfigService<AllConfigType>,
) => ({
  fileFilter: (request, file, callback) => {
    if (!file.originalname.match(/\.(mp3)$/i)) {
      return callback(
        new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: `cantUploadFileType`,
          },
        }),
        false,
      );
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: './files/audios',
    filename: (request, file, callback) => {
      callback(
        null,
        `${randomStringGenerator()}.${file.originalname
          .split('.')
          .pop()
          ?.toLowerCase()}`,
      );
    },
  }),
  limits: {
    fileSize: configService.get('file.maxFileSize', { infer: true }),
  },
});
