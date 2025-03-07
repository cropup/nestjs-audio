import {
  HttpStatus,
  // common
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FilesService } from '../files/files.service';
import { FilesLocalService } from '../files/infrastructure/uploader/local/files.service';
import { FileType } from '../files/domain/file';
import { AudioRepository } from './infrastructure/persistence/audio.repository';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { Audio } from './domain/audio';

@Injectable()
export class AudiosService {
  constructor(
    private readonly filesService: FilesService,
    private readonly localFilesService: FilesLocalService,

    // Dependencies here
    private readonly audioRepository: AudioRepository,
  ) {}

  async create(file: Express.Multer.File) {
    // Do not remove comment below.
    // <creating-property />
    const fileObject = await this.localFilesService.create(file);

    return this.audioRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      file: fileObject.file,
      size: file.size,
      mimeType: file.mimetype,
      originalFilename: file.originalname,
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
