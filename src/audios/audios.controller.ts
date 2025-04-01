import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AudiosService } from './audios.service';
import { UpdateAudioDto } from './dto/update-audio.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { Audio } from './domain/audio';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAudiosDto } from './dto/find-all-audios.dto';
import { AudioCreatedEvent } from './events/audio-created.event';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@ApiTags('Audios')
@Controller({
  path: 'audios',
  version: '1',
})
export class AudiosController {
  constructor(
    private readonly audiosService: AudiosService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Audio })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    const uploadedFile = await this.audiosService.create(file);
    this.eventEmitter.emit(
      'audio.created',
      new AudioCreatedEvent({
        fileId: uploadedFile.file.id,
        audioId: uploadedFile.id,
        payload: {},
      }),
    );

    return uploadedFile;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: InfinityPaginationResponse(Audio),
  })
  async findAll(
    @Query() query: FindAllAudiosDto,
  ): Promise<InfinityPaginationResponseDto<Audio>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.audiosService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Audio,
  })
  findById(@Param('id') id: string) {
    return this.audiosService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Audio,
  })
  update(@Param('id') id: string, @Body() updateAudioDto: UpdateAudioDto) {
    return this.audiosService.update(id, updateAudioDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.audiosService.remove(id);
  }
}
