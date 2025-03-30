import { AudiosService } from '../audios/audios.service';
import { Audio } from '../audios/domain/audio';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { TranscriptRepository } from './infrastructure/persistence/transcript.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Transcript } from './domain/transcript';
import { FilesLocalService } from '../files/infrastructure/uploader/local/files.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class TranscriptsService {
  constructor(
    private readonly audioService: AudiosService,
    private readonly fileService: FilesLocalService,
    private readonly geminiService: GeminiService,

    // Dependencies here
    private readonly transcriptRepository: TranscriptRepository,
  ) {}

  async create(createTranscriptDto: CreateTranscriptDto) {
    // Do not remove comment below.
    // <creating-property />

    const audioObject = await this.audioService.findById(
      createTranscriptDto.audio.id,
    );
    if (!audioObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          audio: 'notExists',
        },
      });
    }
    const audio = audioObject;

    return this.transcriptRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      provider: createTranscriptDto.provider,

      audio,

      text: createTranscriptDto.text,
    });
  }

  async createForAudio(audioId: Audio['id']) {
    const audio = await this.audioService.findById(audioId);
    if (!audio) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { audio: 'notExists' },
      });
    }

    const audioPart = await this.fileService.getAudioFileAsBase64(
      audio.file.id,
    );

    const transcript = await this.geminiService.transcribeAudio(audioPart);

    return this.create({
      audio: { id: audioId },
      text: transcript,
      provider: 'gemini',
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transcriptRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Transcript['id']) {
    return this.transcriptRepository.findById(id);
  }

  findByIds(ids: Transcript['id'][]) {
    return this.transcriptRepository.findByIds(ids);
  }

  async update(
    id: Transcript['id'],

    updateTranscriptDto: UpdateTranscriptDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let audio: Audio | undefined = undefined;

    if (updateTranscriptDto.audio) {
      const audioObject = await this.audioService.findById(
        updateTranscriptDto.audio.id,
      );
      if (!audioObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            audio: 'notExists',
          },
        });
      }
      audio = audioObject;
    }

    return this.transcriptRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      provider: updateTranscriptDto.provider,

      audio,

      text: updateTranscriptDto.text,
    });
  }

  remove(id: Transcript['id']) {
    return this.transcriptRepository.remove(id);
  }
}
