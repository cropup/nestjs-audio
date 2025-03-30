import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromise from 'fs/promises';
import { FileRepository } from '../../persistence/file.repository';
import { AllConfigType } from '../../../../config/config.type';
import { FileType } from '../../../domain/file';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    return {
      file: await this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path}`,
      }),
    };
  }

  async getAudioFileAsBase64(
    fileId: string,
  ): Promise<{ data: string; mimeType: string }> {
    const fileDto = await this.fileRepository.findById(fileId);

    if (!fileDto) {
      throw new NotFoundException('File not found');
    }

    const filename = fileDto?.path.split('/').pop();
    if (!filename) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    const fullPath = path.join('./files/audios', filename);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    const file = await fsPromise.readFile(fullPath);

    return {
      data: file.toString('base64'),
      mimeType: 'audio/mpeg',
    };
  }
}
