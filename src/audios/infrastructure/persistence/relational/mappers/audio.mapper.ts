import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { Audio } from '../../../../domain/audio';
import { AudioEntity } from '../entities/audio.entity';

export class AudioMapper {
  static toDomain(raw: AudioEntity): Audio {
    const domainEntity = new Audio();
    if (raw.file) {
      domainEntity.file = FileMapper.toDomain(raw.file);
    }

    domainEntity.size = raw.size;

    domainEntity.mimeType = raw.mimeType;

    domainEntity.originalFilename = raw.originalFilename;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Audio): AudioEntity {
    const persistenceEntity = new AudioEntity();
    if (domainEntity.file) {
      persistenceEntity.file = FileMapper.toPersistence(domainEntity.file);
    }

    persistenceEntity.size = domainEntity.size;

    persistenceEntity.mimeType = domainEntity.mimeType;

    persistenceEntity.originalFilename = domainEntity.originalFilename;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
