import { IsString, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAudioDto {
  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  originalFilename: string;
}
