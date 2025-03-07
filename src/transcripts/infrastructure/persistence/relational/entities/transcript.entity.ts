import { AudioEntity } from '../../../../../audios/infrastructure/persistence/relational/entities/audio.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'transcript',
})
export class TranscriptEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  provider?: string | null;

  @ManyToOne(() => AudioEntity, { eager: true, nullable: false })
  audio: AudioEntity;

  @Column({
    nullable: false,
    type: String,
  })
  text: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
