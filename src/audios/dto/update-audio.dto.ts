// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAudioDto } from './create-audio.dto';
import { FileType } from '../../files/domain/file';

export class UpdateAudioDto extends PartialType(CreateAudioDto) {
  @ApiProperty({ type: () => FileType })
  file: FileType;
}
