import {
  // decorators here
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';
import { FileDto } from '../../files/dto/file.dto';

export class CreateAudioDto {
  @ApiProperty({
    required: true,
    type: () => FileDto,
  })
  @ValidateNested()
  @Type(() => FileDto)
  @IsNotEmptyObject()
  file: FileDto;

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

  // Don't forget to use the class-validator decorators in the DTO properties.
}
