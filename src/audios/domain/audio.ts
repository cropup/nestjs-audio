import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';

export class Audio {
  @ApiProperty({
    type: () => FileType,
    nullable: false,
  })
  file: FileType;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  size: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  mimeType: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  originalFilename: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
