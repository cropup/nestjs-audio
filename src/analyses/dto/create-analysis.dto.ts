import { TranscriptDto } from '../../transcripts/dto/transcript.dto';

import { AudioDto } from '../../audios/dto/audio.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateAnalysisDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  errors?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  summary?: string | null;

  @ApiProperty({
    required: false,
    type: () => TranscriptDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranscriptDto)
  @IsNotEmptyObject()
  transcript?: TranscriptDto | null;

  @ApiProperty({
    required: true,
    type: () => AudioDto,
  })
  @ValidateNested()
  @Type(() => AudioDto)
  @IsNotEmptyObject()
  audio: AudioDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
