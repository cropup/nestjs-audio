import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { AudioRepository } from './infrastructure/persistence/audio.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Audio } from './domain/audio';

@Injectable()
export class AudiosService {
  constructor(
    // Dependencies here
    private readonly audioRepository: AudioRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAudioDto: CreateAudioDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.audioRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAudioDto: UpdateAudioDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.audioRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Audio['id']) {
    return this.audioRepository.remove(id);
  }
}
