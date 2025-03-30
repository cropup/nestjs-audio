import { TranscriptEntity } from '../../../../../transcripts/infrastructure/persistence/relational/entities/transcript.entity';
import { AudioEntity } from '../../../../../audios/infrastructure/persistence/relational/entities/audio.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AnalysisError } from '../../../../../analyses/domain/analysis-error';

@Entity({
  name: 'analysis',
})
export class AnalysisEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  errors?: AnalysisError[] | null;

  @Column({
    nullable: true,
    type: String,
  })
  summary?: string | null;

  @ManyToOne(() => TranscriptEntity, { eager: true, nullable: true })
  transcript?: TranscriptEntity | null;

  @ManyToOne(() => AudioEntity, { eager: true, nullable: false })
  audio: AudioEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
