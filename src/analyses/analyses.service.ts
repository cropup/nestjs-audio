import { TranscriptsService } from '../transcripts/transcripts.service';
import { Transcript } from '../transcripts/domain/transcript';

import { AudiosService } from '../audios/audios.service';
import { Audio } from '../audios/domain/audio';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { AnalysisRepository } from './infrastructure/persistence/analysis.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Analysis } from './domain/analysis';
import { OnEvent } from '@nestjs/event-emitter';
import { AudioCreatedEvent } from '../audios/events/audio-created.event';
import { FilesLocalService } from '../files/infrastructure/uploader/local/files.service';
import { OpenAiService } from '../ai/openai.service';

@Injectable()
export class AnalysesService {
  constructor(
    private readonly transcriptService: TranscriptsService,
    private readonly audioService: AudiosService,
    private readonly analysisRepository: AnalysisRepository,
    private readonly fileService: FilesLocalService,
    private readonly openaiService: OpenAiService,
  ) {}

  async create(createAnalysisDto: CreateAnalysisDto) {
    // Do not remove comment below.
    // <creating-property />

    let transcript: Transcript | null | undefined = undefined;

    if (createAnalysisDto.transcript) {
      const transcriptObject = await this.transcriptService.findById(
        createAnalysisDto.transcript.id,
      );
      if (!transcriptObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transcript: 'notExists',
          },
        });
      }
      transcript = transcriptObject;
    } else if (createAnalysisDto.transcript === null) {
      transcript = null;
    }

    const audioObject = await this.audioService.findById(
      createAnalysisDto.audio.id,
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

    return this.analysisRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      errors: createAnalysisDto.errors,

      summary: createAnalysisDto.summary,

      transcript,

      audio,
    });
  }

  @OnEvent('audio.created')
  async handleAudioCreatedEvent(payload: AudioCreatedEvent) {
    const audioFilePath = await this.fileService.getAudioFilePath(
      payload.fileId,
    );
    const transcription =
      await this.openaiService.transcribeAudio(audioFilePath);

    const savedTranscript = await this.transcriptService.create({
      audio: { id: payload.audioId },
      text: transcription,
      provider: 'openai',
    });

    if (transcription.length <= 10) {
      return console.log('Too short to analyze:', transcription);
    }

    const errors = await this.openaiService.analyzeTranscript(transcription);
    if (!errors) {
      return;
    } else if (!errors.length) {
      console.log('🔵 No errors found. AudioId:', payload.audioId);
    }

    await this.create({
      errors,
      audio: { id: payload.audioId },
      transcript: { id: savedTranscript.id },
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.analysisRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findAllHours(): Promise<{ hour: string; count: number }[]> {
    return this.analysisRepository.findAllHours();
  }

  findAllByHour(hour: string): Promise<Analysis[]> {
    return this.analysisRepository.findAllByHour(hour);
  }

  findById(id: Analysis['id']) {
    return this.analysisRepository.findById(id);
  }

  findByIds(ids: Analysis['id'][]) {
    return this.analysisRepository.findByIds(ids);
  }

  async update(
    id: Analysis['id'],

    updateAnalysisDto: UpdateAnalysisDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let transcript: Transcript | null | undefined = undefined;

    if (updateAnalysisDto.transcript) {
      const transcriptObject = await this.transcriptService.findById(
        updateAnalysisDto.transcript.id,
      );
      if (!transcriptObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transcript: 'notExists',
          },
        });
      }
      transcript = transcriptObject;
    } else if (updateAnalysisDto.transcript === null) {
      transcript = null;
    }

    let audio: Audio | undefined = undefined;

    if (updateAnalysisDto.audio) {
      const audioObject = await this.audioService.findById(
        updateAnalysisDto.audio.id,
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

    return this.analysisRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      errors: updateAnalysisDto.errors,

      summary: updateAnalysisDto.summary,

      transcript,

      audio,
    });
  }

  remove(id: Analysis['id']) {
    return this.analysisRepository.remove(id);
  }
}
