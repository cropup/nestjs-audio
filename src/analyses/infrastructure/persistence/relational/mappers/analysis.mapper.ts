import { Analysis } from '../../../../domain/analysis';

import { TranscriptMapper } from '../../../../../transcripts/infrastructure/persistence/relational/mappers/transcript.mapper';

import { AudioMapper } from '../../../../../audios/infrastructure/persistence/relational/mappers/audio.mapper';

import { AnalysisEntity } from '../entities/analysis.entity';

export class AnalysisMapper {
  static toDomain(raw: AnalysisEntity): Analysis {
    const domainEntity = new Analysis();
    domainEntity.errors = raw.errors;

    domainEntity.summary = raw.summary;

    if (raw.transcript) {
      domainEntity.transcript = TranscriptMapper.toDomain(raw.transcript);
    } else if (raw.transcript === null) {
      domainEntity.transcript = null;
    }

    if (raw.audio) {
      domainEntity.audio = AudioMapper.toDomain(raw.audio);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Analysis): AnalysisEntity {
    const persistenceEntity = new AnalysisEntity();
    persistenceEntity.errors = domainEntity.errors;

    persistenceEntity.summary = domainEntity.summary;

    if (domainEntity.transcript) {
      persistenceEntity.transcript = TranscriptMapper.toPersistence(
        domainEntity.transcript,
      );
    } else if (domainEntity.transcript === null) {
      persistenceEntity.transcript = null;
    }

    if (domainEntity.audio) {
      persistenceEntity.audio = AudioMapper.toPersistence(domainEntity.audio);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
