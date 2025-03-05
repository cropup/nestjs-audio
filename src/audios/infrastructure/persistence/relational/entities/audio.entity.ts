import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

@Entity({
  name: 'audio',
})
export class AudioEntity extends EntityRelationalHelper {
  @OneToOne(() => FileEntity, { eager: true, nullable: false })
  @JoinColumn()
  file: FileEntity;

  @Column({
    nullable: false,
    type: Number,
  })
  size: number;

  @Column({
    nullable: false,
    type: String,
  })
  mimeType: string;

  @Column({
    nullable: false,
    type: String,
  })
  originalFilename: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
