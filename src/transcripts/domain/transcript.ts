import { Audio } from '../../audios/domain/audio';
import { ApiProperty } from '@nestjs/swagger';

export class Transcript {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  provider?: string | null;

  @ApiProperty({
    type: () => Audio,
    nullable: false,
  })
  audio: Audio;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  text: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
