import { Transcript } from '../../transcripts/domain/transcript';
import { Audio } from '../../audios/domain/audio';
import { ApiProperty } from '@nestjs/swagger';

export class Analysis {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  errors?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  summary?: string | null;

  @ApiProperty({
    type: () => Transcript,
    nullable: true,
  })
  transcript?: Transcript | null;

  @ApiProperty({
    type: () => Audio,
    nullable: false,
  })
  audio: Audio;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
