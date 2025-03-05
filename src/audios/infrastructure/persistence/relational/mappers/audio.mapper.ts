import { Audio } from '../../../../domain/audio';
import { AudioEntity } from '../entities/audio.entity';

export class AudioMapper {
  static toDomain(raw: AudioEntity): Audio {
    const domainEntity = new Audio();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Audio): AudioEntity {
    const persistenceEntity = new AudioEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
