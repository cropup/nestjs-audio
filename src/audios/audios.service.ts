import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { AudioRepository } from './infrastructure/persistence/audio.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Audio } from './domain/audio';
import { FilesService } from '../files/files.service';
import { FileType } from '../files/domain/file';

@Injectable()
export class AudiosService {
  constructor(
    private readonly filesService: FilesService,

    // Dependencies here
    private readonly audioRepository: AudioRepository,
  ) {}

  async create(createAudioDto: CreateAudioDto) {
    // Do not remove comment below.
    // <creating-property />
    const fileObject = await this.filesService.findById(createAudioDto.file.id);
    if (!fileObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'notExists',
        },
      });
    }
    const file = fileObject;

    return this.audioRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      file,

      size: createAudioDto.size,

      mimeType: createAudioDto.mimeType,

      originalFilename: createAudioDto.originalFilename,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.audioRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Audio['id']) {
    return this.audioRepository.findById(id);
  }

  findByIds(ids: Audio['id'][]) {
    return this.audioRepository.findByIds(ids);
  }

  async update(
    id: Audio['id'],

    updateAudioDto: UpdateAudioDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let file: FileType | undefined = undefined;

    if (updateAudioDto.file) {
      const fileObject = await this.filesService.findById(
        updateAudioDto.file.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'notExists',
          },
        });
      }
      file = fileObject;
    }

    return this.audioRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      file,

      size: updateAudioDto.size,

      mimeType: updateAudioDto.mimeType,

      originalFilename: updateAudioDto.originalFilename,
    });
  }

  remove(id: Audio['id']) {
    return this.audioRepository.remove(id);
  }
}
