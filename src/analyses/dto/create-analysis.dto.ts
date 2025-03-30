import { TranscriptDto } from '../../transcripts/dto/transcript.dto';

import { AudioDto } from '../../audios/dto/audio.dto';

import { Type } from 'class-transformer';

import {
  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsArray,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AnalysisErrorDto } from './analysis-error.dto';

export class CreateAnalysisDto {
  @ApiProperty({
    required: false,
    type: () => [AnalysisErrorDto],
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalysisErrorDto)
  @ValidateIf((o) => o.errors !== null)
  errors?: AnalysisErrorDto[] | null;

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
}
