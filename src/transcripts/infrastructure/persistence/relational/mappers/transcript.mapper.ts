import { Transcript } from '../../../../domain/transcript';

import { AudioMapper } from '../../../../../audios/infrastructure/persistence/relational/mappers/audio.mapper';

import { TranscriptEntity } from '../entities/transcript.entity';

export class TranscriptMapper {
  static toDomain(raw: TranscriptEntity): Transcript {
    const domainEntity = new Transcript();
    domainEntity.provider = raw.provider;

    if (raw.audio) {
      domainEntity.audio = AudioMapper.toDomain(raw.audio);
    }

    domainEntity.text = raw.text;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Transcript): TranscriptEntity {
    const persistenceEntity = new TranscriptEntity();
    persistenceEntity.provider = domainEntity.provider;

    if (domainEntity.audio) {
      persistenceEntity.audio = AudioMapper.toPersistence(domainEntity.audio);
    }

    persistenceEntity.text = domainEntity.text;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
