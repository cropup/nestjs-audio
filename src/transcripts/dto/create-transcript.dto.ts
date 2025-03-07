import { AudioDto } from '../../audios/dto/audio.dto';

import {
  // decorators here

  IsString,
  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateTranscriptDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  provider?: string | null;

  @ApiProperty({
    required: true,
    type: () => AudioDto,
  })
  @ValidateNested()
  @Type(() => AudioDto)
  @IsNotEmptyObject()
  audio: AudioDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  text: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
