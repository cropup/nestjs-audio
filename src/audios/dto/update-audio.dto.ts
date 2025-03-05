// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAudioDto } from './create-audio.dto';

export class UpdateAudioDto extends PartialType(CreateAudioDto) {}
