import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TranscriptEntity } from '../entities/transcript.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Transcript } from '../../../../domain/transcript';
import { TranscriptRepository } from '../../transcript.repository';
import { TranscriptMapper } from '../mappers/transcript.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TranscriptRelationalRepository implements TranscriptRepository {
  constructor(
    @InjectRepository(TranscriptEntity)
    private readonly transcriptRepository: Repository<TranscriptEntity>,
  ) {}

  async create(data: Transcript): Promise<Transcript> {
    const persistenceModel = TranscriptMapper.toPersistence(data);
    const newEntity = await this.transcriptRepository.save(
      this.transcriptRepository.create(persistenceModel),
    );
    return TranscriptMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Transcript[]> {
    const entities = await this.transcriptRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TranscriptMapper.toDomain(entity));
  }

  async findById(id: Transcript['id']): Promise<NullableType<Transcript>> {
    const entity = await this.transcriptRepository.findOne({
      where: { id },
    });

    return entity ? TranscriptMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Transcript['id'][]): Promise<Transcript[]> {
    const entities = await this.transcriptRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TranscriptMapper.toDomain(entity));
  }

  async update(
    id: Transcript['id'],
    payload: Partial<Transcript>,
  ): Promise<Transcript> {
    const entity = await this.transcriptRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.transcriptRepository.save(
      this.transcriptRepository.create(
        TranscriptMapper.toPersistence({
          ...TranscriptMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TranscriptMapper.toDomain(updatedEntity);
  }

  async remove(id: Transcript['id']): Promise<void> {
    await this.transcriptRepository.delete(id);
  }
}
